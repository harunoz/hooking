const puppeteer = require("puppeteer");

(async () => {
const browser = await puppeteer.launch({ headless: false, defaultViewport: null });

try {
  const [page] = await browser.pages();

  await page.exposeFunction('_notifyShowDirectoryPicker', (directoryName) => {
    console.log(`showDirectoryPicker was called. Selected directory: ${directoryName}`);
  });
  await page.exposeFunction('_notifyRemoveEntry', (name) => {
    console.log(`removeEntry was called for ${name}.`);
  });

  await page.exposeFunction('_notifyWriteClose',(name) => {
    console.log(`Write.Close was called for ${name}.`)
  });

  await page.exposeFunction('_notifyCreateWritable',(name) => {
    console.log(`CreateWritable was called for ${name}.`)
  });

  await page.exposeFunction('_notifyWrite',(name) => {
    console.log(`Write was called for ${name}.`)
  });



  await page.evaluateOnNewDocument(() => {
    const _oldShowDirectoryPicker = window.showDirectoryPicker.bind(window);

    window.showDirectoryPicker = async function newShowDirectoryPicker() {
      const directoryHandle = await _oldShowDirectoryPicker();
      window._notifyShowDirectoryPicker(directoryHandle.name);
      return directoryHandle;
    };



    const _oldRemoveEntry = FileSystemDirectoryHandle.prototype.removeEntry;
    FileSystemDirectoryHandle.prototype.removeEntry = async function newRemoveEntry(name, options) {
       //Uncomment to not prevent the deletion.
      await _oldRemoveEntry.call(this, name, options);
      window._notifyRemoveEntry(name);

    };
    console.log("4")
    const _oldCreateWriteFirst = FileSystemWritableFileStream.prototype.createWritable;
    console.log("1")
    FileSystemWritableFileStream.prototype.CreateWritable = async function newCreate(name,options) {
      console.log("2")
       //Uncomment to not prevent the deletion.
   //   await _oldCreateWriteFirst .call(this,name,options);
      console.log("3")
      window._notifyCreateWritable(name);

    };
    console.log("4")
    const _oldCreateWrite = FileSystemWritableFileStream.prototype.write;
    console.log("1")
    FileSystemWritableFileStream.prototype.write = async function newWrite(name,options) {
      console.log("2")
       //Uncomment to not prevent the deletion.
      await _oldCreateWrite.call(this,name,options);
      console.log("3")
      window._notifyWrite(name);

    };
    const _oldCloseWriter = FileSystemWritableFileStream.prototype.close;

    FileSystemWritableFileStream.prototype.close = async function newClose(name,options) {


//      await _oldCloseWriter.call(this,name,options);

      window._notifyWriteClose(name);

    };



    //const _oldWriteClose = FileSystemWriter.close;
   // FileSystemWriter.close = async function newCloseEntry(name,options){
    //  console.log("test6")
     // await _oldWriteClose.call(this, name, options);
      //console.log("name")
     // window._notifyWriteClose(name)
   // };

  });

  await page.goto('https://harunoz.github.io/browserCRY/main.html');

 // await page.evaluate(async () => {
  //  const directoryHandle = await window.showDirectoryPicker();
   // await directoryHandle.removeEntry('1.txt');
  //});
} catch (err) { console.error(err); } finally {   await new Promise(done => setTimeout(done, 100000));
    await browser.close(); }

})();
