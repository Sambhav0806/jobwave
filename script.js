console.log("script.js loaded");


const keywordInput = document.getElementById("keywordInput");
const locationInput = document.getElementById("locationInput");
const searchBtn = document.getElementById("searchBtn");
const jobCardsContainer = document.getElementById("jobCardsContainer");
const darkModeToggle = document.getElementById("darkModeToggle");


async function fetchLocalJobs(keyword = "", location = "") {
    try {
        const response = await fetch("./employment.json");
        if (!response.ok) throw new Error("Failed to load employment.json");

        const data = await response.json();

       
        let jobs = data.employment; 

        console.log("Jobs loaded:", jobs);

        
        jobs = jobs.slice(1);

       
        if (keyword.trim()) {
            jobs = jobs.filter(job =>
                job.Column1?.toLowerCase().includes(keyword.toLowerCase()) ||
                job.Column3?.toLowerCase().includes(keyword.toLowerCase()) ||
                job.Column5?.toLowerCase().includes(keyword.toLowerCase())
            );
        }

       
        if (location.trim()) {
            jobs = jobs.filter(job =>
                job.Column7?.toLowerCase().includes(location.toLowerCase())
            );
        }

        return jobs;
    } catch (error) {
        console.error("Error loading jobs:", error);
        return [];
    }
}


function displayJobs(jobs) {
    jobCardsContainer.innerHTML = "";

    if (!jobs || jobs.length === 0) {
        jobCardsContainer.innerHTML =
            "<p style='text-align:center;'>No jobs found.</p>";
        return;
    }

    jobs.forEach(job => {
        const jobCard = document.createElement("div");
        jobCard.className = "job-card";

        jobCard.innerHTML = `
            <div class="job-header">
                <img src="https://via.placeholder.com/50" class="company-logo" alt="logo">
                <div class="job-info">
                    <h3>${job.Column1}</h3>
                    <p>${job.Column3}</p>
                </div>
                <span class="job-tag new">${job.Column7}</span>
            </div>

            <p class="job-location">
                <strong>Level:</strong> ${job.Column2}
            </p>

            <p class="salary-range">
                <strong>Eligibility:</strong> ${job.Column4}
            </p>

            <div class="job-meta">
                <span class="tag green">${job.Column5}</span>
                <a href="${job.Column6}" target="_blank" class="apply-btn">
                    Official Website
                </a>
            </div>
        `;

        jobCardsContainer.appendChild(jobCard);
    });
}


searchBtn.addEventListener("click", async () => {
    jobCardsContainer.innerHTML =
        "<p style='text-align:center;'>Loading jobs...</p>";

    const jobs = await fetchLocalJobs(
        keywordInput.value,
        locationInput.value
    );

    displayJobs(jobs);
});


window.addEventListener("DOMContentLoaded", async () => {
    const jobs = await fetchLocalJobs();
    displayJobs(jobs);
});


if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
}
