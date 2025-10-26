class ProductBox {
  constructor(image, box, parent, RL) {
    this.img = image;
    this.con = box;
    this.parent = parent;
    this.RL = RL; //R:True,L:False
    //this.ReSetHeight();
  }

  ReSetHeight() {
    let height = 0;
    const para = this.con.querySelectorAll("p");
    para.forEach((p) => {
      height += p.height;
    });

    //this.img.style.height = `${height}px`;
  }

  ReOrder(small) {
    if (small) {
      this.parent.style.display = "block";
      this.parent.appendChild(this.img);
      this.parent.appendChild(this.con);
      this.img.style.maxWidth = "90%";
      this.img.classList.remove("right");
      this.con.classList.remove("left");
      this.img.classList.add("left");
      this.con.classList.add("right");
    } else {
      this.parent.style.display = "flex";
      if (this.RL) {
        this.img.classList.remove("left");
        this.con.classList.remove("right");
        this.parent.appendChild(this.con);
        this.parent.appendChild(this.img);
        this.parent.style.justifyContent = "flex-end";
        this.img.classList.add("right");
        this.con.classList.add("left");
      } else {
        this.img.classList.remove("right");
        this.con.classList.remove("left");
        this.parent.appendChild(this.img);
        this.parent.appendChild(this.con);
        this.parent.style.justifyContent = "flex-start";
        this.img.classList.add("left");
        this.con.classList.add("right");
      }

      this.img.style.maxWidth = "60%";
    }
  }
}

let prods = [];

let chachIndex = null;
let chachSpecial = null;
let contentLoading = false;
let fadeImages = null;
let fadeObserver = null;
const basePath = "https://tkorigami16-lab.github.io/TKoriken"; //GitHub の親ページを取得
const jsPath = "https://cdn.jsdelivr.net/gh/tkorigami16-lab/TKoriken@v1.0.6";

//画像が開かれたときに Awake() を発火するようにする
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMの読み込みが完了しました");
  await Awake();
});

async function Awake() {
  document.documentElement.classList.add("no-scroll");
  document.body.classList.add("no-scroll");

  //Make Overlay Appear
  let over = document.getElementById("overlay");
  over.classList.remove("hidden");

  //Set Title Panel
  let loading = document.getElementById("loadPanel");
  loading.classList.remove("hide");

  //Set Container
  let container = document.getElementById("cont");
  container.classList.add("hidden");

  //Black
  let black = document.getElementById("Black");
  black.style.opacity = 1;

  //Title,MenuBox
  try {
    if (chachSpecial == null) {
      const res = await fetch(jsPath + "/data/SpecialIndex.json");
      const json = await res.json();
      chachSpecial = json;
    }
    const set = chachSpecial.special;
    let mobilemenuBox = document.getElementById("mobileMenuList");
    let desktopmenubox = document.getElementById("desktopMenuList");
    //maxTask += 2 * set.length;

    //Body
    let BGI = document.getElementById("BackGroundImage");
    let s = jsPath + "/data/WEBPimages/BackGroundImage.webp";

    if (
      (await checkFileExists(
        basePath + "/data/WEBPimages/BackGroundImage.webp"
      )) == true
    ) {
      BGI.src = s;
      console.log("BackGround SetUp Complete");
    } else {
      console.log("Failed to load BackGroundImage");
    }

    //Menu
    let menuIcon = document.getElementById("menuIcon");
    s = jsPath + "/data/WEBPimages/MenuBox.webp";
    if (await checkFileExists(basePath + "/data/WEBPimages/MenuBox.webp")) {
      menuIcon.src = s;
      console.log("menuIcon ok");
    } else {
      console.log("Fail to load menuIcon");
    }

    let home = document.createElement("li");
    let bo = document.createElement("button");
    bo.type = "button";
    bo.addEventListener("click", () => {
      CreateMainContents();
    });
    bo.classList.add("luxury-button");
    bo.textContent = "ホーム";
    home.appendChild(bo);
    mobilemenuBox.appendChild(home);
    let cloneH = home.cloneNode(true);
    let clonedButtonH = cloneH.querySelector("button");
    clonedButtonH.addEventListener("click", () => {
      CreateMainContents();
    });
    desktopmenubox.append(cloneH);

    for (let i = 0; i < set.length; i++) {
      let child = document.createElement("li");
      let b = document.createElement("button");
      b.type = "button";
      b.addEventListener("click", () => {
        console.log("ok");
        CreateSpecialContents(set[i].title);
      });
      b.classList.add("luxury-button");
      b.textContent = set[i].title;

      child.appendChild(b);
      mobilemenuBox.appendChild(child);
      //carry++;
      //SetProgress();

      let clone = child.cloneNode(true);
      let clonedButton = clone.querySelector("button");
      clonedButton.addEventListener("click", () => {
        console.log("ok");
        CreateSpecialContents(set[i].title);
      });
      desktopmenubox.append(clone);
      //desktopmenubox.append(clone);
      //carry++;
      //SetProgress();

      console.log(set[i].title);
    }
    console.log("Menu SetUp Complete");

    //Title
    let titleImage = document.getElementById("TitleImage");

    s = jsPath + "/data/WEBPimages/Title.webp";

    if (await checkFileExists(basePath + "/data/WEBPimages/Title.webp")) {
      titleImage.src = s;
      console.log("Title SetUp Complete");
    } else {
      console.log("Fail to load titleImage");
    }

    let cont = document.getElementById("cont");
    s = jsPath + "/data/WEBPimages/BackGroundImage.webp";
    if (
      await checkFileExists(basePath + "/data/WEBPimages/BackGroundImage.webp")
    ) {
      cont.style.backgroundImage = s;
    } else {
      console.log("Failed to load BackGround");
    }
  } catch {
    console.log("some Error happened");
  }

  await delay(200);
  black.classList.add("hidden");

  let completeLoadMain = CreateMainContents();

  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });

  // スクロール追従（スマホのみ）
  window.addEventListener("scroll", () => {
    if (window.innerWidth <= 1279) {
      mobileMenu.style.top = `${window.scrollY + 60}px`;
    }
  });

  await delay(600);
  loading.style.opacity = 0;

  container.classList.remove("hidden");
  await delay(800);

  //Make Overlay
  document.documentElement.classList.remove("no-scroll");
  document.body.classList.remove("no-scroll");
  over.classList.add("hidden");
  loading.classList.add("hidden");

  await completeLoadMain;
}

async function CreateMainContents() {
  if (contentLoading) return;
  contentLoading = true;
  try {
    if (chachIndex == null) {
      const res = await fetch(jsPath + "/data/index.json");
      chachIndex = await res.json();
    }

    window.scrollTo({
      top: 0, // 500pxの位置へスクロール
      behavior: "smooth", // スムーズにスクロール
    });

    const fileList = chachIndex;
    let imageList = document.getElementById("image-list"); //コンテンツの親オブジェクト
    imageList.innerHTML = "";

    let parent = document.getElementById("SpecialContent");
    parent.innerHTML = "";

    let CtitleImg = document.getElementById("ContentTitle_Image");
    CtitleImg.src = "";

    let CtitleTxt = document.getElementById("Content_Text");
    CtitleTxt.style.display = "none";

    document.getElementById("title_Text").textContent = "■個人作品";
    document.getElementById("title_Exp").textContent =
      "　筑駒折り研の会員が折った作品です。こだわり抜いたライティングから感じられる紙の繊細な表情をお楽しみください。";

    document.getElementById("mainDiv").classList.remove("hidden");

    let RLnum = 0;

    for (const data of fileList.index) {
      let item = document.createElement("li"); //子オブジェクトを作成
      let con = document.createElement("div");
      con.style.display = "flex";
      con.classList.add("PARENT");

      let img = document.createElement("img");
      let d = document.createElement("div");
      d.classList.add("captions");

      let s = jsPath + `/data/WEBPimages/${data.productName}.webp`;
      if (
        (await checkFileExists(
          basePath + "/data/WEBPimages/" + data.productName + ".webp"
        )) == true
      ) {
        img.src = s;
        img.alt = ".webp";
        //img.width = 200;
        //img.height = 200;
        img.classList.add("fade-in");
        item.appendChild(img);
      } else {
        item.remove();
        img.remove();
        d.remove();
        console.log(data.productName + " img not found");
        return;
      }

      let str = data.productName;
      const names = str.split("_");

      let pro = document.createElement("p");
      pro.textContent = "■ " + names[0];
      pro.style.fontSize = "32px";
      d.appendChild(pro);

      let inv = document.createElement("p");
      if (data.invent == "True") {
        inv.textContent = "会員創作作品";
      } else {
        inv.textContent = "創作 : " + data.inventor;
      }
      inv.style.fontSize = "20px";
      d.appendChild(inv);

      let manu = document.createElement("p");
      manu.textContent = "作成 : " + data.manufacturer;
      manu.style.fontSize = "20px";
      d.appendChild(manu);

      let paper = document.createElement("p");
      paper.textContent = "紙 : " + data.paper;
      paper.style.fontSize = "16px";
      d.appendChild(paper);

      let comtxt = document.createElement("p");
      comtxt.textContent = data.comment;
      comtxt.style.fontSize = "16px";
      d.appendChild(comtxt);

      //carry++;
      //SetProgress();

      if (RLnum % 2 == 1) {
        item.classList.add("left");
        d.classList.add("right");
        con.appendChild(img);
        con.appendChild(d);
        let p = new ProductBox(img, d, con, false);
        p.ReOrder(window.innerWidth < 1279);
        prods.push(p);
      } else {
        item.classList.add("right");
        d.classList.add("left");
        con.appendChild(d);
        con.appendChild(img);
        let p = new ProductBox(img, d, con, true);
        p.ReOrder(window.innerWidth < 1279);
        prods.push(p);
      }
      item.appendChild(con);

      RLnum++;
      imageList.appendChild(item);
      console.log(data.productName + " Created");
    }

    prods.forEach((box) => {
      box.ReOrder(window.innerWidth < 1279);
    });

    window.addEventListener("resize", () => {
      prods.forEach((box) => {
        box.ReOrder(window.innerWidth < 1279);
      });
    });

    SetFadeIn();

    contentLoading = false;
    console.log("Create All Items");
    return true;
  } catch {
    contentLoading = false;
    console.log("some");
  }
}

async function CreateSpecialContents(str) {
  if (contentLoading) return;
  contentLoading = true;

  if (chachSpecial == null) {
    const res = await fetch(
      "https://cdn.jsdelivr.net/gh/tkorigami16-lab/TKoriken@latest/data/SpecialIndex.json"
    );
    const json = await res.json();
    chachSpecial = json;
  }

  const basePath = "https://tkorigami16-lab.github.io/TKoriken";

  const spe = chachSpecial.special;
  for (let i = 0; i < spe.length; i++) {
    if (spe[i].title == str) {
      document.getElementById("mainDiv").classList.add("hidden");
      let imageList = document.getElementById("image-list");
      imageList.innerHTML = "";

      window.scrollTo({
        top: 0, // 500pxの位置へスクロール
        behavior: "smooth", // スムーズにスクロール
      });

      let CtitleImg = document.getElementById("ContentTitle_Image");
      if (await (basePath + `/data/WEBPimages/${str}_TitleImg.webp`))
        CtitleImg.src = `https://cdn.jsdelivr.net/gh/tkorigami16-lab/TKoriken@latest/data/WEBPimages/${str}_TitleImg.webp`;

      document.getElementById("flavorText").textContent = spe[i].AdoTxt;

      document.getElementById("title_Text").textContent = "■" + str;
      document.getElementById("title_Exp").textContent =
        "-" + spe[i].flavor + "-";

      let CtitleTxt = document.getElementById("Content_Text");
      CtitleTxt.style.display = "block";

      let parent = document.getElementById("SpecialContent");
      parent.innerHTML = "";

      let imgNum = 0;
      for (let k = 0; k < spe[i].text.length; k++) {
        let block = document.createElement("div");
        data = spe[i].text[k];

        let tx = document.createElement("p");
        tx.textContent = data.text;
        block.appendChild(tx);

        for (let n = 0; n < data.imgNum; n++) {
          let image = document.createElement("img");
          if (
            await checkFileExists(
              basePath + `/data/WEBPimages/S_${str}_${imgNum}.webp`
            )
          ) {
            image.src = `https://cdn.jsdelivr.net/gh/tkorigami16-lab/TKoriken@latest/data/WEBPimages/S_${str}_${imgNum}.webp`;
            image.style.width = "100%";
            image.classList.add("fade-in");
            imgNum++;
            block.appendChild(image);
          } else {
            imgNum++;
            console.log(
              "NG : " + basePath + `/data/WEMPimages/S_${str}_${imgNum}`
            );
          }
        }
        parent.appendChild(block);
      }

      SetFadeIn();

      contentLoading = false;
      return;
    }
  }

  contentLoading = false;
  console.log(str + " not Found");
}

function SetFadeIn() {
  fadeImages = document.querySelectorAll(".fade-in");

  fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeObserver.unobserve(entry.target); // 一度表示されたら監視解除
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  fadeImages.forEach((img) => fadeObserver.observe(img));
}

async function checkFileExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });

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
