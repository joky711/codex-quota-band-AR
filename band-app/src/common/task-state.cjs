const CHATGPT_STATES = new Set(['running', 'not_running', 'hook_unavailable'])
const TASK_STATES = new Set(['running', 'needs_authorization', 'waiting_for_review'])
const ACTIVITIES = new Set(['executing_command', 'modifying_files', 'using_browser'])

function requireFiniteTimestamp(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`invalid ${name}`)
  return value
}

function sanitizeTaskSnapshotForBand(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('invalid task snapshot')
  }
  if (!CHATGPT_STATES.has(value.chatGptState)) throw new Error('invalid ChatGPT state')
  if (!Array.isArray(value.tasks) || value.tasks.length > 3) throw new Error('invalid task list')

  return {
    generatedAtMs: requireFiniteTimestamp(value.generatedAtMs, 'task snapshot time'),
    chatGptState: value.chatGptState,
    tasks: value.tasks.map((task) => {
      if (!task || typeof task !== 'object' || Array.isArray(task)) {
        throw new Error('invalid task')
      }
      const title = typeof task.title === 'string' ? task.title.trim() : ''
      if (!title || Array.from(title).length > 16 || /[\u0000-\u001f\u007f]/.test(title)) {
        throw new Error('invalid task title')
      }
      if (!TASK_STATES.has(task.state)) throw new Error('invalid task state')
      if (task.activity !== undefined && !ACTIVITIES.has(task.activity)) {
        throw new Error('invalid task activity')
      }
      const sanitized = {
        title,
        state: task.state,
        updatedAtMs: requireFiniteTimestamp(task.updatedAtMs, 'task update time')
      }
      if (task.activity !== undefined) sanitized.activity = task.activity
      return sanitized
    })
  }
}

function relativeTimeText(updatedAtMs, now = new Date()) {
  const elapsedMs = Math.max(0, now.getTime() - updatedAtMs)
  const minutes = Math.floor(elapsedMs / 60000)
  if (minutes < 1) return 'الآن'
  if (minutes < 60) return `${minutes} د`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} س`
  return `${Math.floor(hours / 24)} ي`
}

function taskStatusView(task) {
  if (task.state === 'needs_authorization') {
    return { statusText: 'تحتاج إذن', groupText: 'تحتاج إذن', tone: 'danger', order: 0 }
  }
  if (task.state === 'waiting_for_review') {
    return { statusText: 'للمراجعة', groupText: 'للمراجعة', tone: 'waiting', order: 2 }
  }
  return {
    statusText: 'قيد التنفيذ',
    groupText: 'قيد التنفيذ',
    tone: 'running',
    order: 1
  }
}

function createTaskView(snapshot, now = new Date()) {
  if (!snapshot) {
    return { summaryText: 'المهام غير متاحة', items: [] }
  }
  const sanitized = sanitizeTaskSnapshotForBand(snapshot)
  let summaryText = `${sanitized.tasks.length} مهام`
  if (sanitized.chatGptState === 'not_running') summaryText = 'ChatGPT مطفأ'
  if (sanitized.chatGptState === 'hook_unavailable') summaryText = 'المهام غير متاحة'
  if (sanitized.chatGptState === 'running' && sanitized.tasks.length === 0) {
    summaryText = 'لا توجد مهام'
  }
  const orderedItems = sanitized.tasks
    .map((task) => {
      const status = taskStatusView(task)
      return {
        title: task.title,
        statusText: status.statusText,
        groupText: status.groupText,
        tone: status.tone,
        groupTone: status.tone,
        timeText: relativeTimeText(task.updatedAtMs, now),
        order: status.order
      }
    })
    .sort((left, right) => left.order - right.order)

  const groupCounts = orderedItems.reduce((counts, item) => {
    counts[item.tone] = (counts[item.tone] || 0) + 1
    return counts
  }, {})
  const seenGroups = {}
  const items = orderedItems.map(({ order, ...item }, index) => {
    const showGroup = !seenGroups[item.tone]
    seenGroups[item.tone] = true
    return {
      ...item,
      groupCount: String(groupCounts[item.tone]),
      showGroup,
      layoutClass: showGroup ? 'with-group' : 'row',
      showDivider: index < orderedItems.length - 1
    }
  })

  return {
    summaryText,
    items
  }
}

module.exports = {
  createTaskView,
  relativeTimeText,
  sanitizeTaskSnapshotForBand
}
