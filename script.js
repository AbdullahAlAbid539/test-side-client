import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// আপনার Firebase Config ডাটা এখানে দিন
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "visachecknewzerland.firebaseapp.com",
    databaseURL: "https://visachecknewzerland-default-rtdb.firebaseio.com/",
    projectId: "visachecknewzerland",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const searchForm = document.getElementById('searchForm');
const statusResult = document.getElementById('statusResult');
const errorDisplay = document.getElementById('errorDisplay');

// View Status Button Click
document.getElementById('checkBtn').addEventListener('click', function() {
    const email = document.getElementById('uEmail').value.trim();
    const passport = document.getElementById('uPassport').value.trim();
    const visa = document.getElementById('uVisaType').value;

    // Reset error
    errorDisplay.style.display = "none";

    if (!email || !passport || !visa) {
        showError("দয়া করে সব তথ্য সঠিকভাবে প্রদান করুন।");
        return;
    }

    const safeEmail = email.replace(/\./g, ',');
    const clientRef = ref(db, 'clients/' + safeEmail);

    get(clientRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();

            // ইমেইল মিলেছে, এখন পাসপোর্ট এবং ভিসা টাইপ ম্যাচিং
            if (data.passport === passport && data.visa === visa) {
                // ফর্ম লুকিয়ে রেজাল্ট দেখানো
                searchForm.style.display = "none";
                statusResult.style.display = "block";

                // ডাটা বসানো
                document.getElementById('resName').innerText = data.name;
                document.getElementById('resPassport').innerText = data.passport;
                document.getElementById('resVisa').innerText = data.visa;
                document.getElementById('resStatus').innerText = data.status;
    
            } else {
                // ভুল ইনপুটের জন্য স্পেসিফিক মেসেজ
                let msg = data.passport !== passport ? "Passport Number mismatch!" : "Visa Category mismatch!";
                showError("Invalid Input: " + msg);
            }
        } else {
            showError("Error: This email is not registered in our records!");
        }
    }).catch((err) => {
        showError("Connection Error: " + err.message);
    });
});

// New Search Button Click
document.getElementById('newSearchBtn').addEventListener('click', function() {
    // ইনপুট ক্লিয়ার করা
    document.getElementById('uEmail').value = "";
    document.getElementById('uPassport').value = "";
    document.getElementById('uVisaType').value = "";

    // ইন্টারফেস অদলবদল করা
    statusResult.style.display = "none";
    searchForm.style.display = "block";
});

// Error দেখানোর ফাংশন
function showError(msg) {
    errorDisplay.innerText = msg;
    errorDisplay.style.display = "block";
}