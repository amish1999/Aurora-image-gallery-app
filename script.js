console.clear();

const { useEffect, useState, Fragment, useRef } = React;


const API = 'https://api.unsplash.com';
const CLIENT_ID = '8e31e45f4a0e8959d456ba2914723451b8262337f75bcea2e04ae535491df16d';
const DEFAULT_IMAGE_COUNT = 25;
const IMAGE_INCREMENT_COUNT = 10;

function App() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [prevQuery, setPrevQuery] = useState("");
  const [clickedImage, setClickedImage] = useState({});
  const [isModalActive, setModalActive] = useState(false);
  const [failedToLoad, setFailedToLoad] = useState(false);
  const [perPageCount, setPerPageCount] = useState(DEFAULT_IMAGE_COUNT);
  const [totalResults, setTotalResults] = useState(0);
  const [state, setState] = useState("loading");
  const [queryChanged, setqueryChanged] = useState(false);
  const [page, setPage] = useState("home");

  const loadButtonEl = useRef();

 <!------------->
  
  
  
  

  const searchQuery = () => {
    if (query !== "") {
      setState("loading");
      setPage("search");
      axios(`${API}/search/photos/`, {
        params: {
          query: query,
          per_page: perPageCount,
          client_id: CLIENT_ID } }).


      then(res => {
        setImages(res.data.results);
        setTotalResults(res.data.total);
        if (failedToLoad) setFailedToLoad(false);
      }).
      catch(() => setFailedToLoad(true));
    }
  };

  useEffect(searchQuery, [perPageCount]);

  useEffect(() => {
    if (page === "home") {
      setQuery("");
      setPrevQuery("");
    }
  }, [page]);

  useEffect(() => {
    let loaded = 0;
    let cards = document.getElementsByClassName("image-card");
    for (let i = 0; i < cards.length; i++) {
      // eslint-disable-next-line no-loop-func
      imagesLoaded(cards[i], instance => {
        if (instance.isComplete) loaded++;
        if (loaded === perPageCount) setState("loaded");
      });
    }
  }, [images, perPageCount]);

  const handleSearch = () => {
    if (query !== prevQuery && query !== "") {
      setPerPageCount(DEFAULT_IMAGE_COUNT);
      setPrevQuery(query);
      searchQuery();
    }
  };

  const handleImageClick = img => {
    setClickedImage(img);
    setModalActive(true);
  };

  return (
    React.createElement(Fragment, null,
    React.createElement(Header, {
      onQueryChange: q => {
        setQuery(q);
        setqueryChanged(true);
      },
      onQuerySearch: handleSearch,
      onGenarateRandomImages: () => getRandomPhotos(),
      onPageChange: p => setPage(p) }),


    prevQuery !== "" && page !== "home" &&
    React.createElement("span", { className: "text-info" },
    React.createElement("span", null, "search results for ",
    React.createElement("strong", null, "\"", prevQuery, "\"")),

    React.createElement("span", { className: "total-results" }, "found ",
    React.createElement("strong", null, totalResults), " matching results")),




    query === "" && queryChanged && !failedToLoad &&
    React.createElement("h3", { className: "text-info type-something-info" }, "Type something!"),


    prevQuery !== "" && totalResults === 0 &&
    React.createElement("div", { className: "no-image-found-info" },
    React.createElement("h3", null, "No Images Found"),
    React.createElement("span", null, "Try searching ",
    React.createElement("strong", null, "dogs"), " or ", React.createElement("strong", null, "cats"))),




    !failedToLoad &&
    React.createElement("main", null,
    React.createElement(ImageCardList, {
      images: images,
      onImageClicked: img => handleImageClick(img) }),

    React.createElement("h3", {
      className: "text-info loading-text",
      style: {
        display: state === "loading" && !queryChanged ? "block" : "none" } }, "Loading..."),




    React.createElement("button", {
      className: `btn load-more ${state === "loading" ? "loading" : ""}`,
      ref: loadButtonEl,
      onClick: () => {
        setPerPageCount(perPageCount + IMAGE_INCREMENT_COUNT);
        setState("loading");
      },
      style: {
        display:
        perPageCount >= totalResults || page === "home" ? "none" : "block",
        pointerEvents: state === "loading" ? "none" : "all" } },


    state !== "loading" && "load more" ||
    React.createElement("div", { id: "wave" },
    React.createElement("span", { className: "dot" }),
    React.createElement("span", { className: "dot" }),
    React.createElement("span", { className: "dot" })))) ||





    failedToLoad &&
    React.createElement("div", { className: "failed-info-container" },
    React.createElement("h1", { className: "failed-text" }, "Failed To Load"),
    React.createElement("p", null, "check your connection")),



    isModalActive &&
    React.createElement(Modal, {
      imageData: clickedImage,
      onModalActive: isActive => setModalActive(isActive) })));




}

function resizeMasonryItem(item) {
  let grid = document.getElementsByClassName("masonry")[0],
  rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-row-gap")),
  rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-auto-rows"));
  let rowSpan = Math.ceil(
  (item.querySelector(".masonry-content").getBoundingClientRect().height + rowGap) / (
  rowHeight + rowGap));

  item.style.gridRowEnd = "span " + rowSpan;
}

function resizeAllMasonryItems() {
  let allItems = document.getElementsByClassName("masonry-brick");
  for (let i = 0; i < allItems.length; i++) {
    resizeMasonryItem(allItems[i]);
  }
}

function waitForImages() {
  let allItems = document.getElementsByClassName("masonry-brick");
  for (let i = 0; i < allItems.length; i++) {
    imagesLoaded(allItems[i], instance => {
      const item = instance.elements[0];
      const cardForegroundEl = instance.images[0].img.parentElement.parentElement.querySelector(
      ".image-card-fg");

      item.style.display = "block";
      let t = setTimeout(() => {
        cardForegroundEl.classList.add("hide");
        clearTimeout(t);
      }, 200 + +cardForegroundEl.parentElement.getAttribute("data-card-index") * 120);
      resizeMasonryItem(item);
    });
  }
}

const events = ["load", "resize"];
events.forEach(event => {
  window.addEventListener(event, resizeAllMasonryItems);
});


const Header = ({ onQueryChange, onQuerySearch, onGenarateRandomImages, onPageChange }) => {
  const [isFloatingInputActive, setFloatingInputActive] = useState(false);

  const inputEl = useRef();
  const floatingInputEl = useRef();

  const handleSubmit = e => {
    e.preventDefault();
    // onQuerySearch();
  };

  const handleHomePage = () => {
    onPageChange("home");
    onGenarateRandomImages();
    inputEl.current.value = "";
    floatingInputEl.current.value = "";
  };

  return (
    React.createElement("header", null,
    React.createElement("button", { className: "btn home", onClick: handleHomePage },
    React.createElement("div", { className: "icon gallery" },
    React.createElement("svg", { viewBox: "0 0 388.309 388.309", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", {
      d: "M201.173,307.042c-11.291-0.174-22.177-4.233-30.825-11.494l-56.947-50.155c-8.961-8.373-22.664-9.036-32.392-1.567 L0.03,303.384v38.661c-0.582,10.371,7.355,19.25,17.726,19.832c0.534,0.03,1.07,0.037,1.605,0.021h286.824 c11.494,0,22.988-8.359,22.988-19.853V240.691L226.25,300.25C218.684,304.798,210.001,307.15,201.173,307.042z" }),



    React.createElement("circle", { cx: "196.993", cy: "182.699", r: "22.988" }),
    React.createElement("path", {
      d: "M383.508,67.238c-3.335-4.544-8.487-7.406-14.106-7.837L84.667,26.487c-5.551-0.465-11.091,1.012-15.673,4.18 c-4.058,3.524-6.817,8.307-7.837,13.584l-4.702,40.751h249.731c23.809,0.54,43.061,19.562,43.886,43.363v184.424 c0-1.045,4.702-2.09,6.792-4.18c4.326-3.397,6.834-8.606,6.792-14.106L388.21,82.389 C388.753,76.91,387.057,71.445,383.508,67.238z" }),




    React.createElement("path", {
      d: "M306.185,105.899H19.361c-11.494,0-19.331,10.971-19.331,22.465v148.898l68.963-50.155 c17.506-12.986,41.724-11.895,57.992,2.612l57.469,50.155c8.666,7.357,21.044,8.406,30.824,2.612l113.894-66.351v-87.771 C328.382,116.099,318.465,106.408,306.185,105.899z M196.993,226.584c-24.237,0-43.886-19.648-43.886-43.886 c0-24.237,19.648-43.886,43.886-43.886c24.237,0,43.886,19.648,43.886,43.886C240.879,206.936,221.231,226.584,196.993,226.584z" }))),






    React.createElement("span", { className: "title" }, "Aurora | The Ultimate Gallery")),


    React.createElement("form", { onSubmit: handleSubmit },
    React.createElement("div", { className: "form-group g-1" },
    React.createElement("input", {
      type: "text",
      placeholder: "Type here",
      onChange: () => onQueryChange(inputEl.current.value),
      ref: inputEl }),

    React.createElement("button", {
      className: "btn search",
      onClick: onQuerySearch,
      disabled:
      inputEl.current !== undefined && inputEl.current.value.length === 0 ?
      true :
      false },


    React.createElement("div", { className: "icon search" },
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" },
    React.createElement("path", { d: "M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" }))),


    React.createElement("span", null, "search"))),


    React.createElement("div", { className: "form-group g-2" },
    React.createElement("button", { className: "btn search", onClick: () => setFloatingInputActive(true) },
    React.createElement("div", { className: "icon search" },
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" },
    React.createElement("path", { d: "M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" }))))),





    React.createElement("div", { className: `floating--container ${isFloatingInputActive ? "" : "hide"}` },
    React.createElement("div", { className: "input--container" },
    React.createElement("input", {
      type: "text",
      placeholder: "Type here",
      onChange: () => onQueryChange(floatingInputEl.current.value),
      ref: floatingInputEl }),

    React.createElement("button", {
      className: "btn search",
      onClick: onQuerySearch,
      disabled:
      floatingInputEl.current !== undefined &&
      floatingInputEl.current.value.length === 0 ?
      true :
      false }, "search")),






    React.createElement("button", { className: "btn close", onClick: () => setFloatingInputActive(false) },
    React.createElement("div", { className: "icon cross" },
    React.createElement("svg", {
      viewBox: "0 0 512 512",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "false" },

    React.createElement("path", { d: "M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" }))))))));







};



const ImageCard = ({ imageData, imageIndex, onImageClicked }) => {
  const { urls, alt_description, user, links, color } = imageData;

  return (
    React.createElement("div", { className: "masonry-brick", style: { display: "none" } },
    React.createElement("div", {
      className: "image-card masonry-content",
      style: {
        background: color },

      "data-card-index": `${imageIndex}` },

    React.createElement("img", { className: "image", src: urls.regular, alt: alt_description }),
    React.createElement("div", {
      className: "image-card--clickable-area",
      onClick: () => {
        onImageClicked(imageData);
        document.title = alt_description;
      } }),

    React.createElement("div", { className: "image-card--options" },
    React.createElement("div", { className: "user-info" },
    React.createElement("a", { href: user.links.html, target: "_blank_", tabIndex: "-1" },
    React.createElement("img", { src: user.profile_image.medium, alt: user.name })),

    React.createElement("h3", null, user.name)),

    React.createElement("div", { className: "links" },
    React.createElement("a", {
      className: "link",
      href: `https://instagram.com/${user.instagram_username}`,
      style: {
        display: user.instagram_username ? "block" : "none" },

      target: "_blank_",
      tabIndex: "-1" },

    React.createElement("div", { className: "icon instagram" },
    React.createElement("svg", {
      viewBox: "0 0 448 512",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "false" },

    React.createElement("path", { d: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" })))),




    React.createElement("a", {
      className: "link",
      href: `https://twitter.com/${user.twitter_username}`,
      style: {
        display: user.twitter_username ? "block" : "none" },

      target: "_blank_",
      tabIndex: "-1" },

    React.createElement("div", { className: "icon twitter" },
    React.createElement("svg", {
      viewBox: "0 0 512 512",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "false" },

    React.createElement("path", { d: "M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" })))),




    React.createElement("a", { className: "link", href: `${links.download}?force=true`, tabIndex: "-1" },
    React.createElement("div", { className: "icon download" },
    React.createElement("svg", {
      viewBox: "0 0 32 32",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "false" },

    React.createElement("path", { d: "M25.8 15.5l-7.8 7.2v-20.7h-4v20.7l-7.8-7.2-2.7 3 12.5 11.4 12.5-11.4z" })))))),





    React.createElement("div", {
      className: "image-card-fg",
      style: {
        background: color } }))));





};


const ImageCardList = ({ images, onImageClicked }) => {
  return (
    React.createElement("div", { className: "masonry" },
    images.map((image, index) =>
    React.createElement(ImageCard, {
      imageData: image,
      key: image.id,
      imageIndex: index,
      onImageClicked: img => onImageClicked(img) }))));




};



const months = [
"January",
"February",
"March",
"April",
"May",
"June",
"July",
"August",
"September",
"October",
"November",
"December"];


const Modal = ({ imageData, onModalActive }) => {
  const { urls, alt_description, color, links, height, width, created_at, exif } = imageData;

  const date = new Date(created_at);

  const [dropdownActive, setDropdownActive] = useState(false);
  const [infoActive, setInfoActive] = useState(false);
  const [views, setViews] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [likes, setLikes] = useState(0);
  const [viewsLastMonth, setViewsLastMonth] = useState(0);
  const [downloadsLastMonth, setDownloadsLastMonth] = useState(0);
  const [likesLastMonth, setLikesLastMonth] = useState(0);

  const modalEl = useRef();
  const imageEl = useRef();

  const handleClose = () => {
    modalEl.current.style.display = "none";
    onModalActive(false);
    document.title = "Image Gallery | UNSPLASH";
  };

  const handleDropdown = () => {
    setDropdownActive(!dropdownActive);
  };

  const fetchStats = () => {
    axios(`${API}/photos/${imageData.id}/statistics`, {
      params: {
        client_id: CLIENT_ID } }).

    then(res => {
      // get all the values in an array
      const lastMonthViewValues = res.data.views.historical.values.map(e => e.value);
      const lastMonthDownloadValues = res.data.downloads.historical.values.map(
      e => e.value);

      const lastMonthLikeValues = res.data.likes.historical.values.map(e => e.value);

      // add up the array
      const lastMonthTotalViews = numberFormatter(returnTotal(lastMonthViewValues), 1);
      const lastMonthTotalDownloads = numberFormatter(
      returnTotal(lastMonthDownloadValues),
      1);

      const lastMonthTotalLikes = numberFormatter(returnTotal(lastMonthLikeValues), 1);

      // set all the values
      setViews(res.data.views.total);
      setDownloads(res.data.downloads.total);
      setLikes(res.data.likes.total);
      setViewsLastMonth(lastMonthTotalViews);
      setDownloadsLastMonth(lastMonthTotalDownloads);
      setLikesLastMonth(lastMonthTotalLikes);
    });
  };

  useEffect(fetchStats, []);

  return (
    React.createElement("div", { className: "modal", ref: modalEl },
    React.createElement("div", {
      className: "image-container",
      style: {
        background: color,
        height: width / height > 2 ? "50%" : "80%" } },


    React.createElement("img", { src: urls.full, alt: alt_description, ref: imageEl }),
    React.createElement("button", { className: "btn close", onClick: handleClose },
    React.createElement("div", { className: "icon" },
    React.createElement("svg", {
      viewBox: "0 0 512 512",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "false" },

    React.createElement("path", { d: "M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" })))),




    React.createElement("div", { className: "options--container" },
    React.createElement("div", { className: "group g-1" },
    React.createElement("a", { href: `${links.download}?force=true`, className: "download" }, "download"),


    React.createElement("div", { className: "dropdown-btn--container" },
    React.createElement("button", { className: "btn dropdown", onClick: handleDropdown },
    React.createElement("div", { className: "icon" },
    React.createElement("svg", { viewBox: "0 0 32 32", "aria-hidden": "false" },
    React.createElement("path", { d: "M9.9 11.5l6.1 6.1 6.1-6.1 1.9 1.9-8 8-8-8 1.9-1.9z" })))),




    React.createElement("div", { className: `dropdown--menu ${dropdownActive ? "" : "hide"}`, tabIndex: "-1" },
    React.createElement("ul", null,
    React.createElement("li", null,
    React.createElement("a", { href: `${links.download}?force=true&w=640` }, "Small ",
    React.createElement("span", null, "(640x960)"))),


    React.createElement("li", null,
    React.createElement("a", { href: `${links.download}?force=true&w=1920` }, "Medium ",
    React.createElement("span", null, "(1920x2880)"))),


    React.createElement("li", null,
    React.createElement("a", { href: `${links.download}?force=true&w=2400` }, "Large ",
    React.createElement("span", null, "(2400x3600)"))),


    React.createElement("li", null,
    React.createElement("a", { href: `${links.download}?force=true` }, "Original Size",
    " ",
    React.createElement("span", null, "(",
    height, "x", width, ")"))))))),








    React.createElement("div", { className: "group g-2" },
    React.createElement("button", { className: "btn info", onClick: () => setInfoActive(true) },
    React.createElement("div", { className: "icon" },
    React.createElement("svg", {
      viewBox: "0 0 512 512",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true" },

    React.createElement("path", { d: "M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z" })))))),






    React.createElement("div", {
      className: "image-info--container",
      style: {
        display: infoActive ? "flex" : "none" } },


    React.createElement("div", {
      className: "image-info--modal",
      style: {
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), white 150px), url("${urls.thumb}&auto=format&fit=crop&w=200&q=60&blur=20")` } },


    React.createElement("button", { className: "btn close", onClick: () => setInfoActive(false) },
    React.createElement("div", { className: "icon" },
    React.createElement("svg", {
      viewBox: "0 0 512 512",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "false" },

    React.createElement("path", { d: "M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" })))),




    React.createElement("div", { className: "row row--1" },
    React.createElement("h1", null, "Info"),
    React.createElement("span", null, "Published on ",
    months[date.getMonth()], " ", date.getDate(), ",", " ",
    date.getFullYear())),


    React.createElement("div", { className: "row row--2" },
    React.createElement("div", { className: "image-info views--container" },
    React.createElement("div", { className: "info" },
    React.createElement("div", { className: "icon" },
    React.createElement("svg", {
      version: "1.1",
      viewBox: "0 0 32 32",
      width: "32",
      height: "32",
      "aria-hidden": "false" },

    React.createElement("path", { d: "M31.8 15.1l-.2-.4c-3.5-6.9-9.7-11.5-15.6-11.5-6.3 0-12.3 4.5-15.7 11.7l-.2.4c-.2.5-.2 1.1 0 1.6l.2.4c3.6 7 9.7 11.5 15.6 11.5 6.3 0 12.3-4.5 15.6-11.6l.2-.4c.4-.5.4-1.2.1-1.7zm-2 1.2c-3 6.5-8.3 10.5-13.8 10.5-5.2 0-10.6-4.1-13.8-10.4l-.2-.4.1-.3c3.1-6.5 8.4-10.5 13.9-10.5 5.2 0 10.6 4.1 13.8 10.4l.2.4-.2.3zm-13.8-6.6c-3.5 0-6.3 2.8-6.3 6.3s2.8 6.3 6.3 6.3 6.3-2.8 6.3-6.3-2.8-6.3-6.3-6.3zm0 10.6c-2.4 0-4.3-1.9-4.3-4.3s1.9-4.3 4.3-4.3 4.3 1.9 4.3 4.3-1.9 4.3-4.3 4.3z" }))),


    React.createElement("span", { className: "info--title" }, "Views")),

    React.createElement("div", { className: "info info--value" },
    React.createElement("span", { className: "total-views" }, beautifyNumber(views))),

    React.createElement("div", { className: "monthly-stats" },
    React.createElement("span", { className: "views-stat" }, "+", viewsLastMonth), " since last month")),



    React.createElement("div", { className: "image-info downloads--container" },
    React.createElement("div", { className: "info" },
    React.createElement("div", { className: "icon" },
    React.createElement("svg", {
      version: "1.1",
      viewBox: "0 0 32 32",
      width: "32",
      height: "32",
      "aria-hidden": "false" },

    React.createElement("path", { d: "M27.5 18.08a1 1 0 0 0-1.42 0l-9.08 8.59v-23.67a1 1 0 0 0-2 0v23.67l-9.08-8.62a1 1 0 1 0-1.38 1.45l10.77 10.23a1.19 1.19 0 0 0 .15.09.54.54 0 0 0 .16.1.94.94 0 0 0 .76 0 .54.54 0 0 0 .16-.1l.15-.09 10.77-10.23a1 1 0 0 0 .04-1.42z" }))),


    React.createElement("span", { className: "info info--title" }, "Downloads")),

    React.createElement("div", { className: "info info--value" },
    React.createElement("span", { className: "total-views" }, beautifyNumber(downloads))),

    React.createElement("div", { className: "monthly-stats" },
    React.createElement("span", { className: "downloads-stat" }, "+", downloadsLastMonth), " ", "since last month")),



    React.createElement("div", { className: "image-info likes--container" },
    React.createElement("div", { className: "info" },
    React.createElement("div", { className: "icon" },
    React.createElement("svg", {
      version: "1.1",
      viewBox: "0 -4 32 40",
      width: "32",
      height: "32",
      "aria-hidden": "false" },

    React.createElement("path", { d: "M17.4 29c-.8.8-2 .8-2.8 0l-12.3-12.8c-3.1-3.1-3.1-8.2 0-11.4 3.1-3.1 8.2-3.1 11.3 0l2.4 2.8 2.3-2.8c3.1-3.1 8.2-3.1 11.3 0 3.1 3.1 3.1 8.2 0 11.4l-12.2 12.8z" }))),


    React.createElement("span", { className: "info info--title" }, "Likes")),

    React.createElement("div", { className: "info info--value" },
    React.createElement("span", { className: "total-views" }, beautifyNumber(likes))),

    React.createElement("div", { className: "monthly-stats" },
    React.createElement("span", { className: "likes-stat" }, "+", likesLastMonth), " since last month"))),




    React.createElement("div", { className: "hr-line" }),
    React.createElement("div", { className: "row row--3" },
    React.createElement("div", { className: "camera-info" },
    React.createElement("span", { className: "info--title" }, "Camera Make"),
    React.createElement("span", { className: "info--value" },
    exif !== undefined ? exif.make : "--")),


    React.createElement("div", { className: "camera-info" },
    React.createElement("span", { className: "info--title" }, "Camera Model"),
    React.createElement("span", { className: "info--value" },
    exif !== undefined ? exif.model : "--")),


    React.createElement("div", { className: "camera-info" },
    React.createElement("span", { className: "info--title" }, "Focal Length"),
    React.createElement("span", { className: "info--value" },
    exif !== undefined ? `${exif.focal_length}mm` : "--")),


    React.createElement("div", { className: "camera-info" },
    React.createElement("span", { className: "info--title" }, "Aperture"),
    React.createElement("span", { className: "info--value" },
    exif !== undefined ? `ƒ/${exif.aperture}` : "--")),


    React.createElement("div", { className: "camera-info" },
    React.createElement("span", { className: "info--title" }, "Shutter Speed"),
    React.createElement("span", { className: "info--value" },
    exif !== undefined ? `${exif.exposure_time}s` : "--")),


    React.createElement("div", { className: "camera-info" },
    React.createElement("span", { className: "info--title" }, "ISO"),
    React.createElement("span", { className: "info--value" },
    exif !== undefined ? exif.iso : "--")),


    React.createElement("div", { className: "camera-info" },
    React.createElement("span", { className: "info--title" }, "Dimensions"),
    React.createElement("span", { className: "info--value" },
    `${width} × ${height}` || "--"))))))));








};

function numberFormatter(num, digits) {
  let si = [
  { value: 1, symbol: "" },
  { value: 1e3, symbol: "k" },
  { value: 1e6, symbol: "M" },
  { value: 1e9, symbol: "G" },
  { value: 1e12, symbol: "T" },
  { value: 1e15, symbol: "P" },
  { value: 1e18, symbol: "E" }];

  let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

function beautifyNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function returnTotal(arrOfValues) {
  return arrOfValues.reduce((a, c) => a += c);
}


ReactDOM.render(
React.createElement(App, null),
document.getElementById('root'));
