// --- Configuration for JSearch API ---
// !! IMPORTANT !! Replace 'YOUR_RAPIDAPI_KEY_HERE' with your actual RapidAPI Key
const RAPIDAPI_KEY = '2815ea323dmsh2047e3c990bf683p1ab94cjsnc0d21107c981'; // Your key is here
const RAPIDAPI_HOST = 'jsearch.p.rapidapi.com';
const API_BASE_URL = `https://${RAPIDAPI_HOST}`;

// --- Select HTML Elements ---
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar .search-btn');
// IMPORTANT CHANGE: Select the specific container for job cards
const jobCardsContainer = document.getElementById('jobCardsContainer');

// Optional: If you added a loading spinner element in your HTML with id="loadingSpinner"
// const loadingSpinner = document.getElementById('loadingSpinner');


// --- Function to fetch jobs from JSearch API ---
async function fetchJobs(keywords = 'software developer', location = '', page = 1) {
    // Show a loading indicator
    // if (loadingSpinner) loadingSpinner.style.display = 'block';
    jobCardsContainer.innerHTML = '<p style="text-align: center; margin-top: 20px;">Loading jobs...</p>'; // Temporary loading message

    let searchQuery = keywords;
    if (location) {
        searchQuery += ` ${location}`;
    }

    const url = `${API_BASE_URL}/search?query=${encodeURIComponent(searchQuery)}&page=${page}&num_pages=1`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.message || 'Unknown error'}`);
        }
        const data = await response.json();
        return data.data; // This should be an array of job objects
    } catch (error) {
        console.error("Error fetching jobs:", error);
        jobCardsContainer.innerHTML = `<p style="text-align: center; color: red; margin-top: 20px;">Failed to load jobs. Error: ${error.message}. Please check your API key or try again later.</p>`;
        return [];
    } finally {
        // Hide loading indicator
        // if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

// --- Function to display jobs ---
function displayJobs(jobs) {
    jobCardsContainer.innerHTML = ''; // Clear existing job cards inside #jobCardsContainer

    if (!jobs || jobs.length === 0) {
        jobCardsContainer.innerHTML = '<p style="text-align: center; margin-top: 20px;">No jobs found for your search. Try different keywords or location.</p>';
        return;
    }

    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.classList.add('job-card');

        const jobPostedDate = job.job_posted_at_timestamp ? new Date(job.job_posted_at_timestamp * 1000) : null;
        const isNew = jobPostedDate && (new Date() - jobPostedDate) / (1000 * 60 * 60 * 24) < 7;

        jobCard.innerHTML = `
            <div class="job-header">
                <img src="${job.employer_logo || 'https://via.placeholder.com/40'}" alt="${job.employer_name || 'Company'} Logo" class="company-logo">
                <div class="job-info">
                    <h3>${job.employer_name || 'N/A'}</h3>
                    <p>${job.job_title || 'N/A'}</p>
                </div>
                ${isNew ? '<span class="job-tag new">NEW</span>' : ''}
            </div>
            <p class="job-location">${job.job_city || 'N/A'}, ${job.job_country || 'N/A'}</p>
            <p class="salary-range">${job.salary_min && job.salary_max ? `$${job.salary_min} - $${job.salary_max}` : 'Competitive Salary'}</p>
            <div class="job-meta">
                ${job.job_is_remote ? '<span class="tag orange">REMOTE</span>' : '<span class="tag green">ONSITE</span>'}
                <span class="tag green">${job.job_employment_type || 'Full-time'}</span>
                <a href="${job.job_apply_link}" target="_blank" class="apply-btn">Apply Now</a>
            </div>
        `;
        jobCardsContainer.appendChild(jobCard); // Append to the new container
    });
}

// --- Event listener for the search button ---
searchButton.addEventListener('click', async () => {
    const keywords = searchInput.value.trim();
    const location = ''; // Adjust if you add a separate location input
    const jobs = await fetchJobs(keywords, location);
    displayJobs(jobs);
});

// --- Initial load of jobs when the page loads ---
document.addEventListener('DOMContentLoaded', async () => {
    const initialJobs = await fetchJobs('software developer', 'USA'); // Default search query
    displayJobs(initialJobs);
});

// --- Placeholder for other sections (Popular Companies, Career Resources) ---
// These sections remain statically populated by your initial HTML.
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // --- IMPORTANT: Ensure Font Awesome is loaded for icon changes ---
    // If your Font Awesome is not loading correctly, the icons won't change.
    // Make sure this link is in your <head>:
    // <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    
    // Check for saved user preference, default to light mode if none found
    const currentTheme = localStorage.getItem('theme'); 

    if (currentTheme) {
        body.classList.add(currentTheme); // Apply saved theme
        updateToggleIcon(currentTheme);
    } else {
        // If no theme saved, default to light mode on first visit
        body.classList.add('light-mode'); // Explicitly add light-mode class
        localStorage.setItem('theme', 'light-mode');
        updateToggleIcon('light-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            // Currently dark, switch to light
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
            updateToggleIcon('light-mode');
        } else {
            // Currently light, switch to dark
            body.classList.remove('light-mode'); // Remove explicit light-mode if present
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            updateToggleIcon('dark-mode');
        }
    });

    function updateToggleIcon(theme) {
        if (theme === 'dark-mode') {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Sun icon for dark mode
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Moon icon for light mode
        }
    }
});