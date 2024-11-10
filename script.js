document.getElementById("fetchNewsBtn").addEventListener("click", fetchNews);
document.getElementById("nextBtn").addEventListener("click", showNextArticle);
document.getElementById("prevBtn").addEventListener("click", showPreviousArticle);

let currentIndex = 0;
let newsData = []; 

async function fetchNews() {
  const newsContainer = document.getElementById("newsContainer");

  const apiKey = "YkFe5UhXlAz9ZdSFZ3Jy28Q36tQ5-6fY5Dk1RoZYO2ziMkpW"; 
  const apiUrl = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}`;

  try {
    if (newsData.length === 0) {
      const response = await fetch(apiUrl);
      console.log('API Request URL:', apiUrl); 

      const responseData = await response.json();
      console.log('API data:', responseData); 

      if (!response.ok || !responseData.news || responseData.news.length === 0) {
        throw new Error("No news articles found.");
      }

      newsData = responseData.news;  
      currentIndex = 0; // Reset to the first article when data is fetched
    }

    displayArticle(); // Display the first article

  } catch (error) {
    console.error("Fetch error:", error);
    newsContainer.innerHTML = `<p class='text-red-500'>An error occurred: ${error.message}</p>`;
  }
}

function displayArticle() {
  const newsContainer = document.getElementById("newsContainer");

  // Check if there is valid news data and the index is valid
  if (newsData.length === 0 || currentIndex < 0 || currentIndex >= newsData.length) {
    newsContainer.innerHTML = `<p class='text-gray-500'>No more articles to display.</p>`;
    return;
  }

  const article = newsData[currentIndex];

  // Create article div and add classes
  const articleDiv = document.createElement("div");
  articleDiv.classList.add("news-article", "p-6", "bg-white", "rounded-lg", "shadow-md");

  // Create and append the article title
  const title = document.createElement("h2");
  title.classList.add("text-xl", "font-semibold", "text-gray-800", "mb-2");
  title.textContent = article.title;

  // Create and append the article description
  const description = document.createElement("p");
  description.classList.add("text-gray-700", "mb-4");
  description.textContent = article.description || "No description available.";

  // Create and append the "Read more" link
  const link = document.createElement("a");
  link.classList.add("text-blue-600", "hover:underline");
  link.href = article.url;
  link.target = "_blank";
  link.textContent = "Read more";

  // Append all elements to the article div
  articleDiv.appendChild(title);
  articleDiv.appendChild(description);
  articleDiv.appendChild(link);

  // Clear previous articles and append the new article
  newsContainer.innerHTML = "";  // Clear previous articles
  newsContainer.appendChild(articleDiv);  // Append the new article
}

function showNextArticle() {
  if (currentIndex < newsData.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  displayArticle();
}

function showPreviousArticle() {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = newsData.length - 1;
  }
  displayArticle();
}
