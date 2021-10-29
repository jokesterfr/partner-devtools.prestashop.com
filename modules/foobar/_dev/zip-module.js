const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

const main = async () => {
  const output = fs.createWriteStream(path.join(__dirname, '../foobar.zip'));
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });
  output.on('end', () => {
    console.log('Module foobar has been zipped');
  });
  archive.on('error', function(err) {
    console.error('Error', err);
    throw err;
  });

  archive.append(fs.createReadStream(path.join(__dirname, '../config.xml')), { name: 'foobar/config.xml' });
  archive.append(fs.createReadStream(path.join(__dirname, '../foobar.php')), { name: 'foobar/foobar.php' });
  archive.directory(path.join(__dirname, '../config'), 'foobar/config');
  archive.directory(path.join(__dirname, '../vendor'), 'foobar/vendor');
  archive.directory(path.join(__dirname, '../views'), 'foobar/views');


  archive.pipe(output);
  await archive.finalize();
}
main().then(() => {
  console.log('Module has been created');
  process.exit(0);
}).catch(error => {
  console.error(error);
  process.exit(1);
})