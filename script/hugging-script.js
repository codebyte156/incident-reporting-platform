// Global variable to store current coordinates
window.currentCoordinates = { latitude: 'N/A', longitude: 'N/A' };

function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu.style.display === "flex") {
    mobileMenu.style.display = "none";
  } else {
    mobileMenu.style.display = "flex";
    mobileMenu.style.flexDirection = "column";
  }
}

// Voice Recognition Function (accepts an input field's ID)
function startVoiceRecognition(inputId) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onresult = function(event) {
      document.getElementById(inputId).value = event.results[0][0].transcript;
    };
    
    recognition.onerror = function(event) {
      alert('Voice recognition error: ' + event.error);
    };
    
    recognition.start();
  } else {
    alert('Speech recognition is not supported in this browser. Please use a supported browser (e.g., Chrome) and ensure your site is served over HTTPS.');
  }
}

// Firebase Imports and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB4HYrucSTLrP3e9MPfiRfCRj003lKxtDU",
  authDomain: "safety-reports-pict.firebaseapp.com",
  projectId: "safety-reports-pict",
  storageBucket: "safety-reports-pict.firebasestorage.app",
  messagingSenderId: "976553129981",
  appId: "1:976553129981:web:1e85d6202bf2e8d4d94b94",
  measurementId: "G-SQ8505FPMF"
};

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

// Handle Confirm Report & Send (Firebase submission code is commented out)
document.getElementById("confirmReportButton").addEventListener("click", async () => {
  const incidentType = document.getElementById("incidentType").value;
  const location = document.getElementById("location").value;
  const dateOfIncident = document.getElementById("dateOfIncident").value;
  const victimname = document.getElementById('victimname').value;
  const victimage = document.getElementById('victimage').value;
  const phydescriptionvictim = document.getElementById('phydescriptionvictim').value;
  const injuriesorharm = document.getElementById('injuriesorharm').value;
  const accusedname = document.getElementById('accusedname').value;
  const accuseddescription = document.getElementById('accuseddescription').value;
  const eventsequence = document.getElementById('eventsequence').value;
  const witnesses = document.getElementById('witnesses').value;
  const laws = document.getElementById('laws').value;
  const evidence = document.getElementById('evidence').value;
  const complainantdetails = document.getElementById('complainantdetails').value;
  const complainantnumber = document.getElementById('complainantnumber').value;
  const dateandtimeofreport = document.getElementById('dateandtimeofreport').value;

  if (incidentType && location && dateOfIncident) {
    try {
      const docRef = await addDoc(collection(db, "reports"), {
        incidentType,
        location,
        dateOfIncident,
        victimname,
        victimage,
        phydescriptionvictim,
        injuriesorharm,
        accusedname,
        accuseddescription,
        eventsequence,
        witnesses,
        laws,
        evidence,
        complainantdetails,
        complainantnumber,
        dateandtimeofreport,
        timestamp: new Date().toISOString(),
      });
      alert(`Report submitted successfully! Your Report ID: ${docRef.id}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  } else {
    alert("Please fill in all fields.");
  }
});

// Form Submission for Report Generation
document.getElementById('incidentForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const incidentType = document.getElementById("incidentType").value;
  const location = document.getElementById("location").value;
  const dateOfIncident = document.getElementById("dateOfIncident").value;
  const victimname = document.getElementById('victimname').value;
  const victimage = document.getElementById('victimage').value;
  const phydescriptionvictim = document.getElementById('phydescriptionvictim').value;
  const injuriesorharm = document.getElementById('injuriesorharm').value;
  const accusedname = document.getElementById('accusedname').value;
  const accuseddescription = document.getElementById('accuseddescription').value;
  const eventsequence = document.getElementById('eventsequence').value;
  const witnesses = document.getElementById('witnesses').value;
  const laws = document.getElementById('laws').value;
  const evidence = document.getElementById('evidence').value;
  const complainantdetails = document.getElementById('complainantdetails').value;
  const complainantnumber = document.getElementById('complainantnumber').value;
  const dateandtimeofreport = document.getElementById('dateandtimeofreport').value;

  if (incidentType && location && dateOfIncident) {
    const prompt = `Incident involving ${incidentType}. 
The place of incident is ${location} and the date is ${dateOfIncident}. 

Victim Details:  
Name: ${victimname}, Age: ${victimage}, Physical Description: ${phydescriptionvictim}, Injuries or Harm: ${injuriesorharm}.  

Accused Details:  
Name: ${accusedname}, Description: ${accuseddescription}.  

Crime Details:  
Event Sequence: ${eventsequence}.  

Witnesses: ${witnesses}.  

Legal Aspects:  
Relevant Laws: ${laws}, Evidence Collected: ${evidence}.  

Complainant Details:  
Name: ${complainantdetails}, Contact Number: ${complainantnumber}.  

Report Details:  
Date & Time of Report: ${dateandtimeofreport}.`;

    await generateReport(prompt);
    document.getElementById('getHelpButton').style.display = 'inline-block';
  } else {
    alert('Please fill out all the details before generating the report.');
  }
});

// Help Button Event
document.getElementById('getHelpButton').addEventListener('click', async function () {
  const incidentType = document.getElementById('incidentType').value;
  const helpPrompt = `Write measures for ${incidentType} incident.`;
  await generateReport(helpPrompt, true);
});

// Confirm Report Button Event
document.getElementById('confirmReportButton').addEventListener('click', function () {
  alert('Report confirmed and sent!');
});

// GPS Location Button Event
document.getElementById('gpsLocationButton').addEventListener('click', function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Save coordinates globally for later use in PDF generation
        window.currentCoordinates = { latitude, longitude };
        alert(`GPS Location:\nLatitude: ${latitude}\nLongitude: ${longitude}`);
      },
      () => {
        alert('Unable to retrieve location.');
      }
    );
  } else {
    alert('Geolocation is not supported by your browser.');
  }
});

// Function to Generate Report using Hugging Face API
async function generateReport(prompt, isHelp = false) {
  const apiUrl = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct';
  const token = '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';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const body = JSON.stringify({
    inputs: prompt,
    parameters: { "max_new_tokens": 300 },
    task: "text-generation"
  });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: body
    });

    const data = await response.json();
    const generatedText = data[0]?.generated_text || 'Error: Unable to generate the report.';
    // Use the updated format function for improved styling
    document.getElementById('reportContent').innerHTML = formatReportText(generatedText);


    if (isHelp) {
      document.getElementById('generatedReport').scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('generatedReport').style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching data from Hugging Face API:', error);
  }
}

// Improved Report Formatting Function
// Updated Report Formatting Function
function formatReportText(text) {
  // Remove any markdown symbols
  text = text.replace(/\*\*/g, '').replace(/##/g, '');
  
  // Split the text into lines
  const lines = text.split('\n');
  // Define the headers that should be bolded
  const headers = [
    "Report Title",
    "Incident Report",
    "Date of Incident",
    "Location",
    "Date & Time of Report",
    "Location of Report",
    "Complainant",
    "Contact Number",
    "Victim Details",
    "Accused Details",
    "Crime Details",
    "Witnesses",
    "Legal Aspects",
    "Complainant Details",
    "Report Details",
    "Additional Information"
  ];
  
  // Process each line to wrap key labels in <b> tags
  const formattedLines = lines.map(line => {
    line = line.trim();
    if (line === "") {
      return '<br>'; // maintain blank lines as breaks
    }
    // Check if the line contains a colon (assumed to be a label-value pair)
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const label = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      // If the label is one of the defined headers, make it bold
      if (headers.includes(label)) {
        return `<b>${label}:</b> ${value}`;
      } else {
        return `${label}: ${value}`;
      }
    }
    return line;
  });
  
  // Join the formatted lines with line breaks for clean output
  return formattedLines.join('<br>');
}


// Add Images Functionality
document.getElementById('addImageButton').addEventListener('click', function () {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';

  fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const imgElement = document.createElement('img');
      imgElement.src = event.target.result;
      imgElement.style.maxWidth = '100%';
      imgElement.style.margin = '10px 0';
      console.log("Image Base64 Data: ", imgElement.src);
      document.getElementById('reportContent').appendChild(imgElement);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  });

  fileInput.click();
});

// Download PDF Functionality
document.getElementById('downloadPDFButton').addEventListener('click', function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margins = { top: 20, left: 10, right: 10 };
  let yPosition = margins.top;
  const lineHeight = 12;

  // Generate a separate PDF document for images
  const imageDoc = new jsPDF();
  const imageWidth = 180;
  const imageHeight = 120;

  // Add Title to the report PDF
  doc.setFontSize(16);
  doc.text("Incident Report", pageWidth / 2, yPosition, { align: "center" });
  yPosition += lineHeight * 2;

  // Retrieve all field values
  const incidentType = document.getElementById('incidentType').value;
  const location = document.getElementById('location').value;
  const dateOfIncident = document.getElementById('dateOfIncident').value;
  const victimName = document.getElementById('victimname').value;
  const victimAge = document.getElementById('victimage').value;
  const victimDescription = document.getElementById('phydescriptionvictim').value;
  const injuriesOrHarm = document.getElementById('injuriesorharm').value;
  const accusedName = document.getElementById('accusedname').value;
  const accusedDescription = document.getElementById('accuseddescription').value;
  const eventSequence = document.getElementById('eventsequence').value;
  const witnesses = document.getElementById('witnesses').value;
  const laws = document.getElementById('laws').value;
  const evidence = document.getElementById('evidence').value;
  const complainantName = document.getElementById('complainantdetails').value;
  const complainantContact = document.getElementById('complainantnumber').value;
  const dateAndTimeOfReport = document.getElementById('dateandtimeofreport').value;
  
  // Retrieve GPS coordinates stored earlier
  const { latitude, longitude } = window.currentCoordinates;
  
  // Create a text block that includes all fields along with coordinates
  const headerText = `Incident Type: ${incidentType}
Location: ${location}
Date of Incident: ${dateOfIncident}
Victim's Name: ${victimName}
Victim's Age: ${victimAge}
Physical Description of Victim: ${victimDescription}
Injuries or Harm Suffered: ${injuriesOrHarm}
Name of the Accused: ${accusedName}
Description of Accused: ${accusedDescription}
Sequence of Events: ${eventSequence}
Witnesses: ${witnesses}
Relevant Laws: ${laws}
Supporting Evidence: ${evidence}
Complainant's Name: ${complainantName}
Complainant's Contact: ${complainantContact}
Date & Time of Report: ${dateAndTimeOfReport}
GPS Coordinates: Latitude ${latitude}, Longitude ${longitude}`;

  doc.setFontSize(12);
  const headerLines = doc.splitTextToSize(headerText, pageWidth - margins.left - margins.right);
  doc.text(headerLines, margins.left, yPosition);
  yPosition += headerLines.length * lineHeight + 5;

  // Add any images from the reportContent div
  const reportContent = document.getElementById('reportContent');
  const images = reportContent.getElementsByTagName('img');
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const imgData = img.src;
    console.log("Adding Image to PDF: ", imgData);
    doc.addImage(imgData, 'JPEG', margins.left, yPosition, 50, 60);
    yPosition += 70;
  }

  // Generate a separate PDF for images, if any are available
  if (images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const imgData = img.src;
      imageDoc.addImage(imgData, 'JPEG', margins.left, margins.top, imageWidth, imageHeight);
      if (i < images.length - 1) {
        imageDoc.addPage();
      }
    }
    imageDoc.save('incident_images.pdf');
  } else {
    alert('No images to save in the image PDF.');
  }

  // Save the incident report PDF
  doc.save('incident_report.pdf');
});

function fill(){
  console.log("fillalldemo function called");
  document.getElementById('incidentType').value = "Child labor";
  document.getElementById('location').value = "Delhi";
  document.getElementById('dateOfIncident').value = "2023-10-10";
  document.getElementById('victimname').value = "Rahul Kumar";
  document.getElementById('victimage').value = "12";
  document.getElementById('phydescriptionvictim').value = "Small boy, thin build, wearing a school uniform.";
  document.getElementById('injuriesorharm').value = "No visible injuries";
  document.getElementById('accusedname').value = "Factory Owner";
  document.getElementById('accuseddescription').value = "Middle-aged male, in a formal suit.";
  document.getElementById('eventsequence').value = "Child found working in a factory, rescued by authorities.";
  document.getElementById('witnesses').value = "Local NGO volunteers, police officers";
  document.getElementById('laws').value = "Child Labor (Prohibition and Regulation) Act, 1986";
  document.getElementById('evidence').value = "Photographs of the workplace, testimonies.";
  document.getElementById('complainantdetails').value = "Ms. Sharma, NGO representative";
  document.getElementById('complainantnumber').value = "+91-9876543210";
  document.getElementById('dateandtimeofreport').value = "2023-10-15 14:30";
}

// fill();
