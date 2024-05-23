
const run =async()=>{
        await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
    ])
    const refFace = await faceapi.fetchImage(imageDataURL)
    const checkFace = await faceapi.fetchImage('./images/prabhakar.png')

    let refFaceAiData = await faceapi.detectAllFaces(refFace).withFaceLandmarks().withFaceDescriptors()
    let facesToCheckAiData = await faceapi.detectAllFaces(checkFace).withFaceLandmarks().withFaceDescriptors()

let faceMatcher = new faceapi.FaceMatcher(refFaceAiData)
    facesToCheckAiData = faceapi.resizeResults(facesToCheckAiData,checkFace)

     facesToCheckAiData.forEach(face=>{
        const { detection, descriptor } = face
        
        let label = faceMatcher.findBestMatch(descriptor).toString()
        console.log(label)
        if(label.includes("unknown")){
            return
        }
       
      
    })
}
run()