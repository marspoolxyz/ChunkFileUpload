interface UploadFileResponse {
    success: boolean,
    url : string,
    message: string
}

export type Optional<Type> = [Type] | [];


export function unwrap<T>(val: Optional<T>): T | null {
    if (val[0] === undefined) {
      return null;
    } else {
      return val[0];
    }
  }

class FileService 
{
    private file: File

    constructor(file: File) {
        this.file = file
    }

    static getFileExtension(fileName: string): string {
        const fileNames: Array<string> = fileName.split('.')

        console.log("This is a test from waheed" + fileName );

        if (fileNames.length === 0) {
            return ''
        }

        return fileNames[fileNames.length - 1]
    }

    async uploadFile(): Promise<UploadFileResponse> {

        console.log("File = " + this.file.size);

/*888888888888888888888888888888888888888888888888888888888888888*/

const videoBuffer = (await this.file?.arrayBuffer()) || new ArrayBuffer(0);
let encodeArrayBuffer = Array.from(new Uint8Array(videoBuffer));
const MAX_CHUNK_SIZE = 1024 * 500; // 500kb
let chunk = 1;

console.log(this.file.size + " Max " + MAX_CHUNK_SIZE);
const chunkCount = Number(Math.ceil(this.file.size / MAX_CHUNK_SIZE));

console.log("chunkCount = " + chunkCount);
let chunkBuffers = (await this.file?.arrayBuffer()) || new ArrayBuffer(0);
chunkBuffers = new ArrayBuffer(0);
let vidURL = "";
 for (
  let byteStart = 0;
  byteStart < this.file.size;
  byteStart += MAX_CHUNK_SIZE, chunk++
) {
  
  const videoSlice = videoBuffer.slice(
    byteStart,
    Math.min(this.file.size, byteStart + MAX_CHUNK_SIZE)
  );        
  encodeArrayBuffer = Array.from(new Uint8Array(videoSlice));
  console.log(" Byte Start " + byteStart );
  console.log(encodeArrayBuffer); 


  let chunksAsPromises = Array.from(new Uint8Array(encodeArrayBuffer));
  const chunkBuffers: Buffer[] = [];
  
  
    chunksAsPromises.forEach((bytes) => {
    const bytesAsBuffer = Buffer.from(new Uint8Array(bytes));
    chunkBuffers.push(bytesAsBuffer);
    });
    const videoBlob = new Blob([Buffer.concat(chunkBuffers)], {
    type: "image/png",
    });
    vidURL = URL.createObjectURL(videoBlob);
    console.log(vidURL);

  }
/**************************************************************** */
 
        const uploadResponse = await fetch('http://localhost:5000/uploadFile', {
            method: 'POST',
            body: this.getFormData()
        })


        const responseJson = await uploadResponse.json()

        if (responseJson.success === false) {
            return {
                success: false,
                url : vidURL,
                message: responseJson.message
            }

        
        }
         

        
        
        return {
            success: true,
            url : vidURL,
            message: 'Uploaded Successfully'
        }
    }

    private getFormData(): FormData {
        const formData = new FormData()
        formData.append('file', this.file)
        return formData;
    }
}

export default FileService