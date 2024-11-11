const buttonClickSound = new Audio('https://raw.githubusercontent.com/jethermasidong/api-call/refs/heads/main/soundeffect/papersoundeffect.mp3');

document.getElementById("fetchNewsBtn").addEventListener("click", function() {
  buttonClickSound.play().catch(error => {
    console.error("Error playing sound:", error);
  });
  fetchNews();
});

document.getElementById("nextBtn").addEventListener("click", function() {
  buttonClickSound.play().catch(error => {
    console.error("Error playing sound:", error);
  });
  showNextArticle();
});

document.getElementById("prevBtn").addEventListener("click", function() {
  buttonClickSound.play().catch(error => {
    console.error("Error playing sound:", error);
  });
  showPreviousArticle();
});

let currentIndex = 0;
let newsData = [];

async function fetchNews() {
  try {
    const newsContainer = document.getElementById("newsContainer");
    const apiKey = "YkFe5UhXlAz9ZdSFZ3Jy28Q36tQ5-6fY5Dk1RoZYO2ziMkpW"; 
    const apiUrl = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}`;
    const timeout = 5000;

    if (newsData.length === 0) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("News API endpoint not found (404).");
        } else if (response.status === 503) {
          throw new Error("Service is temporarily unavailable (503).");
        } else {
          throw new Error(`Unexpected error: ${response.status}`);
        }
      }

      const responseData = await response.json();

      if (!responseData.news || responseData.news.length === 0) {
        throw new Error("No news articles found.");
      }

      newsData = responseData.news;
      currentIndex = 0;
    }

    displayArticle();
  } catch (error) {
    const newsContainer = document.getElementById("newsContainer");
    if (error.name === 'AbortError') {
      console.error("Fetch error: Request timed out.");
      newsContainer.innerHTML = `<p class='text-red-500'>The request timed out. Please try again later.</p>`;
    } else {
      console.error("Fetch error:", error);
      newsContainer.innerHTML = `<p class='text-red-500'>An error occurred: ${error.message}</p>`;
    }
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
