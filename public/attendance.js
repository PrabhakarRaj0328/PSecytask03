let arr='';
document.addEventListener('DOMContentLoaded',async (event) => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureButton = document.getElementById('capture');
    const context = canvas.getContext('2d');
    let stream;
     
    
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) => {
            stream = mediaStream;
            video.srcObject = stream;
        })
        .catch((error) => {
            console.error('Error accessing the webcam:', error);
        });

    
    captureButton.addEventListener('click',async () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
    
        const imageDataURL = canvas.toDataURL('image/png', 1.0);
        
        video.pause();

        stream.getTracks().forEach(track => track.stop());

        document.getElementById("con").innerHTML=`<img height=${780} width=${680} style="border:2px solid black;" src=${imageDataURL}></img>`;
           
          try {
        const response = await fetch("/dashboard/checkFaces");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const facedata = await response.json();
        await checkFace(facedata);
       
         if (arr === "found") {
           
                fetch("/dashboard/result", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: arr }),
                }).then((response) => response.json())
                  .then(data => console.log(data))
                  .catch(error => console.error('Error:', error));
            }
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
    async function checkFace(facedata){
        for(let i=0;i<facedata.rows.length;i++){
        let Eachface=facedata.rows[i];
       const run =async()=>{
        await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.ageGenderNet.loadFromUri('/models'),
    ])
    const refFace = await faceapi.fetchImage(imageDataURL)
    const checkFace = await faceapi.fetchImage(Eachface.data)
    
    let refFaceAiData = await faceapi.detectAllFaces(refFace).withFaceLandmarks().withFaceDescriptors()
    let facesToCheckAiData = await faceapi.detectAllFaces(checkFace).withFaceLandmarks().withFaceDescriptors()

    let faceMatcher = new faceapi.FaceMatcher(refFaceAiData)
    facesToCheckAiData = faceapi.resizeResults(facesToCheckAiData,checkFace)
      
      for(let j=0;j<facesToCheckAiData.length;j++)
     { const face = facesToCheckAiData[j];
        const { detection, descriptor } = face
        const distance= faceMatcher.findBestMatch(descriptor).distance
        let label = faceMatcher.findBestMatch(descriptor).toString()
        console.log(label)
       if(label.includes("person 1") && distance<0.5)
        { console.log(Eachface.data)
            arr="found";
            break;
        }
    };
    

}   

   await run();
   
  
    }}})})



    
