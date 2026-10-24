import zipfile,struct,sys
src,dst=sys.argv[1],sys.argv[2]
zi=zipfile.ZipFile(src); zo=zipfile.ZipFile(dst,'w')
for info in zi.infolist():
    data=zi.read(info.filename)
    n=zipfile.ZipInfo(info.filename,date_time=info.date_time)
    n.compress_type=info.compress_type; n.external_attr=info.external_attr
    if info.compress_type==zipfile.ZIP_STORED:
        al=16384 if info.filename.endswith('.so') else 4
        off=zo.fp.tell()+30+len(info.filename.encode())
        pad=(-(off+4))%al
        n.extra=struct.pack('<HH',0xD935,pad)+b'\0'*pad
    zo.writestr(n,data)
zo.close()
z=zipfile.ZipFile(dst);bad=0
for i in z.infolist():
    if i.compress_type==0:
        z.fp.seek(i.header_offset);h=z.fp.read(30);fl,el=struct.unpack('<HH',h[26:30]);d=i.header_offset+30+fl+el
        al=16384 if i.filename.endswith('.so') else 4
        if d%al: bad+=1
print('stored entries misaligned:',bad, '| stored so:',sum(1 for i in z.infolist() if i.compress_type==0 and i.filename.endswith('.so')))
