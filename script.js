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
      currentIndex = 0; 
    }

    displayArticle();

  } catch (error) {
    console.error("Fetch error:", error);
    newsContainer.innerHTML = `<p class='text-red-500'>An error occurred: ${error.message}</p>`;
  }
}

function displayArticle() {
  const newsContainer = document.getElementById("newsContainer");

  if (newsData.length === 0 || currentIndex < 0 || currentIndex >= newsData.length) {
    newsContainer.innerHTML = `<p class='text-gray-500'>No more articles to display.</p>`;
    return;
  }

  const article = newsData[currentIndex];

  const articleDiv = document.createElement("div");
  articleDiv.classList.add("news-article", "p-6", "bg-white", "rounded-lg", "shadow-md");

  const title = document.createElement("h2");
  title.classList.add("text-xl", "font-semibold", "text-gray-900", "mb-2");
  title.textContent = article.title;

  const description = document.createElement("p");
  description.classList.add("text-gray-700", "mb-4");
  description.textContent = article.description || "No description available.";

  const link = document.createElement("a");
  link.classList.add("text-blue-600", "hover:underline");
  link.href = article.url;
  link.target = "_blank";
  link.textContent = "Read more";

  articleDiv.appendChild(title);
  articleDiv.appendChild(description);
  articleDiv.appendChild(link);

 
  newsContainer.innerHTML = ""; 
  newsContainer.appendChild(articleDiv);  
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
