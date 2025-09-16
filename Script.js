document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMの読み込みが完了しました");

  await Awake();
});

async function Awake() {
  const basePath = "https://tkorigami16-lab.github.io/TKoriken";
  const imgExt = [".png", ".jpeg"];

  document.documentElement.classList.add("no-scroll");
  document.body.classList.add("no-scroll");

  //Make Overlay Appear
  let over = document.getElementById("overlay");
  over.classList.remove("hidden");

  //Set Title Panel
  let loading = document.getElementById("loadPanel");
  loading.classList.remove("hide");

  //Set Wrap
  let wrap = document.getElementById("wrap");
  wrap.classList.remove("hidden");
  let prog = document.getElementById("prog");
  let span = document.getElementById("LSpan");
  span.textContent = "0 / 0";
  let carry = 0;
  let maxTask = 0;
  prog.style.width = "0%";
  const SetProgress = () => {
    if (maxTask == 0) return;
    prog.style.width = (carry / maxTask) * 100 + "%";
    span.textContent = carry + " / " + maxTask;
  };

  //Set Awake Setting
  await fetch(basePath + "/data/Resources/Setting.json")
    .then((res) => res.json())
    .then(async (set) => {
      let mobilemenuBox = document.getElementById("mobileMenuList");
      let desktopmenubox = document.getElementById("desktopMenuList");
      maxTask += 2 * set.MenuItems.length;

      //Menu
      for (let i = 0; i < set.MenuItems.length; i++) {
        let mm = document.createElement("li");
        let link = document.createElement("a");
        link.textContent = set.MenuItems[i].buttonName;
        link.href = set.MenuItems[i].url;
        mm.appendChild(link);
        mobilemenuBox.appendChild(mm);
        carry++;
        SetProgress();

        let clone = mm.cloneNode(true);
        desktopmenubox.append(clone);
        carry++;
        SetProgress();
      }
      console.log("Menu SetUp Complete");

      //Title
      let titleImage = document.getElementById("TitleImage");
      console.log(
        await checkFileExists(basePath + "/data/Resources/Title.png")
      );

      console.log("Title SetUp Complete");
    })
    .catch((err) => {
      console.log("Not Found : Setting.json");
    });

  //Load and Create Our Products
  await fetch(basePath + "/data/index.json")
    .then((res) => res.json())
    .then(async (fileList) => {
      let imageList = document.getElementById("image-list"); //コンテンツの親オブジェクト
      maxTask += 2 * fileList.length;

      for (let num = 0; num < fileList.length; num++) {
        let item = document.createElement("li"); //子オブジェクトを作成
        let fileName = fileList[num];

        //#region : Set Image
        for (let i = 0; i < imgExt.length; i++) {
          if (
            (await checkFileExists(
              basePath + "/data/Products/" + fileName + imgExt[i]
            )) == true
          ) {
            let img = document.createElement("img");
            img.src = basePath + "/data/Products/" + fileName + imgExt[i];
            img.alt = `(${imgExt[i]})`;
            img.width = 200;
            img.height = 200;
            item.appendChild(img);
            created = true;
            break;
          }
        }
        //#endregion

        carry++;
        SetProgress();

        //#region : Set Texts
        fetch(basePath + "/data/Products/" + fileName + ".json")
          .then((res) => res.json())
          .then((data) => {
            let pro = document.createElement("p");
            pro.textContent = data.productName;
            item.appendChild(pro);

            let inv = document.createElement("p");
            inv.textContent = data.inventor;
            item.appendChild(inv);

            let manu = document.createElement("p");
            manu.textContent = data.manufacturer;
            item.appendChild(manu);

            let paper = document.createElement("p");
            paper.textContent = data.paperSize;
            item.appendChild(paper);
          });
        //#endregion

        carry++;
        SetProgress();

        console.log(item);
        imageList.appendChild(item);
      }
    })
    .catch((err) => {
      console.error("Some Error Happened during Generating the Images", err);
      return;
    });

  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });

  // スクロール追従（スマホのみ）
  window.addEventListener("scroll", () => {
    if (window.innerWidth <= 768) {
      mobileMenu.style.top = `${window.scrollY + 60}px`;
    }
  });

  await delay(200000);

  //Make Overlay
  document.documentElement.classList.remove("no-scroll");
  document.body.classList.remove("no-scroll");
  over.classList.add("hidden");

  wrap.classList.add("hidden");

  loading.classList.add("hide");
}

async function checkFileExists(url) {
  console.log(url);
  try {
    const response = await fetch(url);

    if (response.ok) {
      console.log("OK file exist :" + url);
      return true;
    } else if (response.status === 404) {
      console.log("NG file not exist : " + url);
      return false;
    } else {
      console.log(`⚠️ エラー：${response.status}`);
      return false;
    }
  } catch (error) {
    console.error("⚡ ネットワークエラーまたは例外:", error);
    return false;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
