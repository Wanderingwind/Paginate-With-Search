let allPageBtns = [];
let index = 0;
let itemsPerPage = 3;

const init = async () => {
  // FETCH PRODUCTS
  const url = "https://fakestoreapi.com/products";
  const fetchProducts = async () => {
    const response = await fetch(url);
    const allData = await response.json();
    const data = allData;
    return data;
  };
  const products = await fetchProducts();


  let paginatedProducts = paginate(products);
  let currentProducts = paginatedProducts[0];
  let currentPages = paginatedProducts;
  let currentPageId = 1;


  //DISPLAY PRODUCTS
  const container = document.querySelector(".news-container");

  //DISPLAY BUTTONS
  const btnContainer = document.querySelector(".btn-container");
  let prevBtn = document.querySelectorAll(".prev-button");
  let nextBtn = document.querySelectorAll(".next-button");

  let pageBtns = [];

  const searchForm = document.querySelector(".product-search-input");

  // Display Products
  const displayProducts = (products) => {
    let pagesHtml = "";
    if (products.length === 0) {
      let pagesHtml = `<div class="mt-4"><h5>No matches found.</h5></div>`;
      container.innerHTML = pagesHtml;
      return;
    }

    for (const i in products) {
      const { title, description, category } = products[i];
      pagesHtml += `
        <div class='col-12 col-md-4'>
          <div class="news-block pt-4">
            <h4>${title}</h4>
            <p class="summary-text">${description}</p>
            <p>${category}</p>
          </div>
        </div>
       `;
      container.innerHTML = pagesHtml;
    }
  };

  // Display Buttons
  function displayButtons(pagedPages) {
    let btnCounts = 5;
    allPageBtns = [];
    for (const i in pagedPages) {
      allPageBtns.push(
        `<button class="page-btn page-links" id="${
          parseInt(i) + 1
        }" type="button">${parseInt(i) + 1}</button>`
      );
    }

    if (pagedPages.length < btnCounts) {

      allPageBtns = allPageBtns.slice(0, btnCounts);
      // show all buttons
    } else if (+currentPageId + 2 >= pagedPages.length) {
      allPageBtns = allPageBtns.slice(pagedPages.length - btnCounts);
      // this will last buttons
      // show pagedPages.length - btnCnt
      // show last buttons
    } else if (currentPageId < 3) {

      allPageBtns = allPageBtns.slice(0, btnCounts);
    } else {

      allPageBtns = allPageBtns.slice(currentPageId - 3, currentPageId + 2);

    }
    let butttonsHtml = allPageBtns.join("");
    //Insert the buttons into the DOM
    btnContainer.innerHTML = `
      <button class="prev-btn page-btn" type="button">prev</button>
      ${butttonsHtml}
      <button class="next-btn page-btn" type="button">next</button>
    `;

    handleBtnClick();
  }

  function handleBtnClick() {
    // set click events
    let btnElements = document.querySelectorAll(".page-btn"); // on page
    for (const i of btnElements) {
      i.addEventListener("click", (e) => {
        let clickedBtn = e.target;

        // Clear active button
        let activeBtn = document.querySelector(".active-btn");

        if (activeBtn) {

          activeBtn.classList.remove("active-btn");
        } else {
          document.getElementById(currentPageId).classList.add("active-btn");
        }

        if (clickedBtn.id) {
          currentPageId = parseInt(clickedBtn.id);

        }
        //Handles actual going to the pages
        if (
          clickedBtn.classList.contains("prev-btn") &&
          parseInt(currentPageId) > 1
        ) {
          currentPageId = --currentPageId;
          goToPage(currentPageId);
          document.getElementById(currentPageId).classList.add("active-btn");
          return;
        }

        if (
          clickedBtn.classList.contains("next-btn") &&
          currentPageId < currentPages.length
        ) {
          currentPageId = ++currentPageId;
          goToPage(currentPageId);
          document.getElementById(currentPageId).classList.add("active-btn");
          return;
        }
        if (
          !clickedBtn.classList.contains("prev-btn") &&
          !clickedBtn.classList.contains("next-btn")
        ) {
          goToPage(currentPageId);
        }

        document.getElementById(currentPageId).classList.add("active-btn");
      });
    }
  }

  //Go to page on button click
  function goToPage(pageId) {
    // [p,p,p]
    currentProducts = currentPages[currentPageId - 1];
    displayProducts(currentProducts);
    displayButtons(currentPages);
  }

  //PAGINATE
  function paginate(pages) {
    let numberOfPages = Math.ceil(pages.length / itemsPerPage);
    const pagedProducts = Array.from({ length: numberOfPages }, (_, index) => {
      const start = index * itemsPerPage;
      return pages.slice(start, start + itemsPerPage);
    });
    return pagedProducts;
  }

  //  Search Function
  function search(e) {
    e.preventDefault();
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === "") {
      // searching = false;
      // set back to normal pages
      currentPages = paginatedProducts;
      displayProducts(currentPages[0]);
      displayButtons(currentPages);
      currentPageId = 1;
      document.getElementById(currentPageId).classList.add("active-btn");
      return;
    }

    let matchedProducts = products.filter((i) => {
      return (
        i.title.toLowerCase().includes(searchTerm) ||
        i.description.toLowerCase().includes(searchTerm)
      );
    });
    currentPages = paginate(matchedProducts);
    displayProducts(currentPages[0]);
    displayButtons(currentPages);
    currentPageId = 1;
    document.getElementById(currentPageId).classList.add("active-btn");
  }
  searchForm.addEventListener("keyup", search);

  const setupUI = () => {
    displayProducts(currentPages[0]);
    displayButtons(currentPages);
    document.getElementById(currentPageId).classList.add("active-btn");
  };
  setupUI();
};
window.addEventListener("load", init);
