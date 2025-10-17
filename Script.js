class ProductBox {
  constructor(image, box, parent, RL) {
    this.img = image;
    this.con = box;
    this.parent = parent;
    this.RL = RL; //R:True,L:False
    this.ReSetHeight();
  }

  ReSetHeight() {
    let height = 0;
    const para = this.con.querySelectorAll("p");
    para.forEach((p) => {
      height += p.height;
    });

    this.img.style.height = `${height}px`;
  }

  ReOrder(small) {
    if (small) {
      this.parent.style.display = "block";
      this.parent.appendChild(this.img);
      this.parent.appendChild(this.con);
      this.img.style.width = "420px";
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
        this.img.classList.add("right");
        this.con.classList.add("left");
      } else {
        this.img.classList.remove("right");
        this.con.classList.remove("left");
        this.parent.appendChild(this.img);
        this.parent.appendChild(this.con);
        this.img.classList.add("left");
        this.con.classList.add("right");
      }
      this.ReSetHeight();
    }
  }
}

let prods = [];

//画像が開かれたときに Awake() を発火するようにする
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMの読み込みが完了しました");
  await Awake();
});

async function Awake() {
  const basePath = "https://tkorigami16-lab.github.io/TKoriken"; //GitHub の親ページを取得

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

  let black = document.getElementById("Black");
  black.style.opacity = 1;

  //Title,MenuBox
  try {
    const res = await fetch(basePath + "/data/SpecialIndex.json");
    const json = await res.json();
    const set = json.special;
    let mobilemenuBox = document.getElementById("mobileMenuList");
    let desktopmenubox = document.getElementById("desktopMenuList");
    maxTask += 2 * set.length;

    //Body
    let BGI = document.getElementById("BackGroundImage");
    let TB = document.getElementById("TitleBack");
    let s =
      "https://cdn.jsdelivr.net/gh/tkorigami16-lab/TKoriken@latest/data/WEBPimages/BackGroundImage.webp";

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
    for (let i = 0; i < set.length; i++) {
      let mm = document.createElement("li");
      let link = document.createElement("a");
      link.textContent = set[i].buttonName;
      link.href = set[i].url;
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

    s =
      "https://cdn.jsdelivr.net/gh/tkorigami16-lab/TKoriken@latest/data/WEBPimages/Title.webp";

    if (
      (await checkFileExists(basePath + "/data/WEBPimages/Title.webp")) == true
    ) {
      titleImage.src = s;
      console.log("Title SetUp Complete");
    } else {
      console.log("Fail to load titleImage");
    }

    let cont = document.getElementById("cont");
    s =
      "https://cdn.jsdelivr.net/gh/tkorigami16-lab/TKoriken@latest/data/WEBPimages/BackGroundImage.webp";
    if (
      await checkFileExists(basePath + "/data/WEBPimages/BackGroundImage.webp")
    ) {
      cont.style.backgroundImage = s;
    } else {
      console.log("Failed to load BackGround");
    }
  } catch {}

  black.classList.add("hidden");

  try {
    const res = await fetch(basePath + "/data/index.json");
    const fileList = await res.json();
    let imageList = document.getElementById("image-list"); //コンテンツの親オブジェクト
    maxTask += 2 * fileList.index.length;
    let RLnum = 0;

    for (const data of fileList.index) {
      let item = document.createElement("li"); //子オブジェクトを作成
      let con = document.createElement("div");
      con.style.display = "flex";

      let img = document.createElement("img");
      let d = document.createElement("div");
      d.classList.add("captions");

      let s = `https://cdn.jsdelivr.net/gh/tkorigami16-lab/TKoriken@latest/data/WEBPimages/${data.productName}.webp`;
      if (
        (await checkFileExists(
          basePath + "/data/WEBPimages/" + data.productName + ".webp"
        )) == true
      ) {
        img.src = s;
        //img.src = basePath + "/data/WEBPimages/" + data.productName + ".webp";
        img.alt = ".webp";
        img.width = 200;
        img.height = 200;
        item.appendChild(img);
      } else {
        carry += 2;
        SetProgress();
        item.remove();
        img.remove();
        d.remove();
        console.log(data.productName + " img not found");
        return;
      }

      carry++;
      SetProgress();

      let str = data.productName;
      const names = str.split("_");

      let pro = document.createElement("p");
      pro.textContent = "■ " + names[0];
      pro.style.fontSize = "32px";
      d.appendChild(pro);

      let inv = document.createElement("p");
      inv.textContent = "創作 : " + data.inventor;
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

      carry++;
      SetProgress();

      if (RLnum % 2 == 1) {
        item.classList.add("left");
        d.classList.add("right");
        con.appendChild(img);
        con.appendChild(d);
        prods.push(new ProductBox(img, d, item, false));
      } else {
        item.classList.add("right");
        d.classList.add("left");
        con.appendChild(d);
        con.appendChild(img);
        prods.push(new ProductBox(img, d, item, true));
      }
      item.appendChild(con);

      RLnum++;
      imageList.appendChild(item);
      console.log(data.productName + " Created");
    }
  } catch {}
  console.log("Create All Items");

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

  window.addEventListener("resize", () => {
    prods.forEach((box) => {
      box.ReOrder(window.innerWidth < 1279);
    });
  });

  prods.forEach((box) => {
    box.ReOrder(window.innerWidth < 1279);
  });

  prog.style.width = "100%";
  prog.style.backgroundColor = "#44dc81";
  span.textContent = "Complete Loading";

  wrap.style.display = "None";
  loading.style.opacity = 0;
  container.classList.remove("hidden");
  await delay(1000);

  //Make Overlay
  document.documentElement.classList.remove("no-scroll");
  document.body.classList.remove("no-scroll");
  over.classList.add("hidden");
  wrap.classList.add("hidden");
  loading.classList.add("hidden");
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
