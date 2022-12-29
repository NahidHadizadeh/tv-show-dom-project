const arrayOfObject = [];
const rowElem = document.querySelector(".row-main");
const countAllItemElem = document.querySelector(".count-episode span");
const selectEpisodeElem = document.querySelector("#select-Episode");

let countOfItem = 0; // شمارنده تعداد آیتم ها
// =========================
// پرامیس دریافت آیتم ها از ای پی آی
async function axiosFuncForGetInformation() {
  rowElem.innerHTML = "";
  const res = axios.get("https://api.tvmaze.com/shows/82/episodes", {
    Headers: {
      Accept: "Application/json",
    },
  });
  res
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      data.forEach((item) => {
        countOfItem++;
        arrayOfObject.push(item);
        creatElems2(item);
        return countOfItem;
      });
    })
    //  نمایش تعداد آیتم های دریافتی در بالای پیج
    .then(() => showCountOfItems())
    .catch((res) => {
      alert(`error : ${res.message}`);
    });
}
axiosFuncForGetInformation();
// =========================
function creatElems(item) {
  rowElem.insertAdjacentHTML(
    "afterbegin",
    `<div class="col col-sm-6 col-md-4 col-lg-3 col-12">
                <div class="card" >
                <img class="card-img-top" src="${item.image.medium}" alt=" image of tv" />
                  <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <h6 class="card-title-episode"><span>S0${item.season}E0${item.number}</span></h6>
                    <p class="card-text " onclick="showAndHideDestription(this,${item.summary})">
                      ${item.summary}
                    </p>
                    <a href="${item.url}" class="btn btn-link ">link back TVmaze</a>
                    </div>
                </div>
                </div>`
  );
}
// ========================
// فانکشن ساخت و ادد المنتهای مورد نیاز برای نمایش اطلاعات دریافتی از ای پی آی
function creatElems2(item) {
  const colElem = document.createElement("div");
  colElem.classList.add("col", "col-sm-6", "col-md-4", "col-lg-3", "col-12");
  colElem.id = `S0${item.season}E0${item.number}`;
  const cardElem = document.createElement("div");
  cardElem.classList.add("card");
  const imgElem = document.createElement("img");
  imgElem.classList.add("card-img-top");
  imgElem.src = item.image.medium;
  imgElem.alt = "image of movie " + item.name;
  const cardBodyElem = document.createElement("div");
  cardBodyElem.classList.add("card-body");
  const cardTitleElem = document.createElement("h5");
  cardTitleElem.classList.add("card-title");
  cardTitleElem.innerHTML = item.name;
  const cardTitleEpisodeElem = document.createElement("h6");
  cardTitleEpisodeElem.classList.add("card-title-episode");
  if (item.number < 10) {
    cardTitleEpisodeElem.innerHTML = `<span>S0${item.season}E0${item.number}</span>`;
  } else {
    cardTitleEpisodeElem.innerHTML = `<span>S0${item.season}E${item.number}</span>`;
  }
  const cardTextElem = document.createElement("p");
  cardTextElem.innerHTML = item.summary.slice(0, 50) + "...";
  cardTextElem.classList.add("card-text", "summary");
  cardTextElem.addEventListener("mouseover", () => {
    showAndHideDestription(cardTextElem, `${item.summary}`);
  });
  const btnLinkElem = document.createElement("a");
  btnLinkElem.classList.add("btn", "btn-link");
  btnLinkElem.href = item.url;
  btnLinkElem.innerHTML = "link back TVmaze";
  cardBodyElem.append(
    cardTitleElem,
    cardTitleEpisodeElem,
    cardTextElem,
    btnLinkElem
  );

  cardElem.append(imgElem, cardBodyElem);
  colElem.append(cardElem);
  rowElem.insertAdjacentElement("beforeend", colElem);

  // === ساخت و اضافه کردن آپشن به المنت سلکت
  const optionElem = document.createElement("option");
  if (item.number < 10) {
    optionElem.value = `S0${item.season}E0${item.number}`;
    optionElem.innerText = `S0${item.season}E0${item.number}`;
  } else {
    optionElem.value = `S0${item.season}E${item.number}`;
    optionElem.innerText = `S0${item.season}E${item.number}`;
  }
  selectEpisodeElem.append(optionElem);
}
// ============
// با انتخاب اپیزود مورد نظر ،همان اپیزود بولد میشود
selectEpisodeElem.addEventListener("change", (e) => {
  // سایه ی همه ی اپیزودها را برمیدارد
  document
    .querySelectorAll(".col .card")
    .forEach((item) => (item.style.boxShadow = " 0 0 0 0"));
  console.log("selectEpisodeElem.elements");

  window.location = `#${e.target.value}`; /// برای اینکه به اپیزود انتخابی لینک شود
  // تنها اپیزود انتخاب شده را سایه میدهد تا بولد و مشخص شود
  document.querySelector(`#${e.target.value} .card`).style.boxShadow =
    " 0px 0px 3px 2px #c1c1c1";
});
// =========================
// با هاور روی توضیحات آن را به صورت خلاصه و یا کامل نمایش میدهد
function showAndHideDestription(cardText, summary) {
  //کلاس سامری برای چک کردن خلاصه بودن یا کامل بودن متن نمایش داده شده است
  if (cardText.classList.contains("summary")) {
    cardText.innerHTML = summary;
    cardText.classList.remove("summary");
  } else {
    cardText.innerHTML = summary.slice(0, 50) + "...";
    cardText.classList.add("summary");
  }
}

// ================================
// با واردکردن هر کاراکتر جدید ،آیتمها به روز میشود
document.querySelector("input").addEventListener("keyup", (e) => {
  search(e.target);
});
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let searchInput = form.elements.searchInput;
  if (searchInput.value == "") {
    alert("please enter subject");
  } else {
    search(searchInput);
  }
  form.elements.searchInput.value = "";
});

// ========================
// نمایش آیتم ها با توجه به ورودی کاربر ،از داخل آرایه ای که بعد از گرفته شدن با ای پی آی پر شده است
function search(searchInput) {
  // پاک کردن المنت روو برای اینکه آیتمهای قبلی حذف شود
  rowElem.innerHTML = "";
  // خالی کردن المنت سلکت ،برای اینکه وقتی سرچ میکنیم فقط اپیزودهای موجود را در لیست سلکت نمایش دهد
  selectEpisodeElem.innerHTML = `<option value="select-episode">Select Episode</option>`;

  // به حروف کوچک تبدیل شد تا عمل سرچ روی کوچک بزرگی حروف حساس نباشد :)
  let searchValue = searchInput.value.toLowerCase();
  countOfItem = 0; //اگر بر اساس سرچ چیزی پیدانکرد این متغیر مساوی 0میماند
  for (let i = 0; i < arrayOfObject.length; i++) {
    if (
      arrayOfObject[i].name.toLowerCase().includes(searchValue) ||
      arrayOfObject[i].summary.toLowerCase().includes(searchValue)
    ) {
      countOfItem++;
      creatElems2(arrayOfObject[i]);
    }
  }
  if (countOfItem === 0) {
    //اگربعد از سرچ آیتمی برای نمایش پیدا نکرد،
    //  امکان نمایش مجدد همه ی آیتم ها را با ساختن المنتهای 12خط پایین فراهم میکند.
    const divElem = document.createElement("div");
    const pElem = document.createElement("p");
    pElem.style.display = "inline";
    const refreshElem = document.createElement("span");
    refreshElem.innerHTML = "Show All Items";
    refreshElem.classList.add("refreshPage");
    refreshElem.addEventListener("click", () => {
      axiosFuncForGetInformation();
      document.querySelector(".form-control").value = ""; //خالی کردن اینپوت سرچ
    });
    pElem.innerHTML = `Nothing found with    "${searchValue}"    subject. `;
    divElem.append(pElem, refreshElem);
    rowElem.insertAdjacentElement("beforeend", divElem);
  }
  showCountOfItems();
}

// ====================
// نمایش تعداد آیتم های موجود نمایش داده شده
function showCountOfItems() {
  countAllItemElem.innerHTML = `Number of episode : ${countOfItem} `;
}
