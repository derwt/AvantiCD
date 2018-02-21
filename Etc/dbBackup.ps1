$now = Get-Date -f yyyy-MM-dTHH-MM-ss;
$begin = 'cmd /c start powershell -Command { Push-Location "C:\Program Files\MongoDB\Server\3.6\bin"; ./mongoexport.exe --host AvantiCD-shard-0/avanticd-shard-00-00-s9cbj.mongodb.net:27017,avanticd-shard-00-01-s9cbj.mongodb.net:27017,avanticd-shard-00-02-s9cbj.mongodb.net:27017 --ssl --username derwt --password ryanthompson --authenticationDatabase admin --db avantiCD --collection Customers --type json --out ';
$path = 'C:\Users\d_tho\Documents\GitHub\AvantiCD\Etc\Data\customers_' + $now + '.json';
$end = '; }';
$export = $begin + $path + $end;
invoke-expression $export
$compressed = $path.TrimEnd('.json') + '.zip';
Start-Sleep 4
Compress-Archive $path -DestinationPath $compressed
Remove-Item $path
# invoke-expression 'cmd /c start powershell -Command { Push-Location "C:\Users\d_tho\Documents\GitHub\AvantiCD"; npm run dev; Read-Host }'