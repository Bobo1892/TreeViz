function TreeNode(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

function buildTreeFromArray(array) {
  if (!array.length || array[0] === null) return null;

  const root = new TreeNode(array[0]);
  const queue = [root];
  let i = 1;

  while (i < array.length && queue.length > 0) {
    const parent = queue.shift();
    if (!parent) {
      if (i < array.length) {
        queue.push(null);
        i++;
      }
      if (i < array.length) {
        queue.push(null);
        i++;
      }
      continue;
    }

    if (i < array.length) {
      if (array[i] !== null) {
        parent.left = new TreeNode(array[i]);
      }
      queue.push(parent.left ?? null);
      i++;
    }

    if (i < array.length) {
      if (array[i] !== null) {
        parent.right = new TreeNode(array[i]);
      }
      queue.push(parent.right ?? null);
      i++;
    }
  }

  return root;
}

function visualizeTree(array) {
  const treeInner = document.getElementById("treeInner");
  const treeContainer = document.getElementById("treeContainer");
  treeInner.innerHTML = "";
  const root = buildTreeFromArray(array);

  if (!root) {
    treeInner.innerHTML = "<p>No tree to visualize</p>";
    return;
  }

  const nodeWidth = 43;
  const horizontalSpacing = 20;
  const verticalSpacing = 100;

  function calculateTreeWidth(node, level = 0, position = 0) {
    if (!node) return 0;
    const leftWidth = calculateTreeWidth(node.left, level + 1, position * 2);
    const rightWidth = calculateTreeWidth(node.right, level + 1, position * 2 + 1);
    return Math.max(nodeWidth, leftWidth + rightWidth);
  }

  const treeWidth = calculateTreeWidth(root);
  treeInner.style.width = `${treeWidth}px`;

  function positionNode(node, level = 0, position = 0, leftBoundary = 0, rightBoundary = treeWidth, parentCenter = null) {
    if (!node) return;

    const nodeElement = document.createElement("div");
    nodeElement.className = "tree-node";
    nodeElement.textContent = node.val;

    const width = rightBoundary - leftBoundary;
    const nodeCenter = leftBoundary + width / 2;

    nodeElement.style.left = `${nodeCenter - nodeWidth / 2}px`;
    nodeElement.style.top = `${level * verticalSpacing}px`;

    treeInner.appendChild(nodeElement);

    if (parentCenter !== null) {
      const lineElement = document.createElement("div");
      lineElement.className = "tree-line";
      const x1 = parentCenter;
      const y1 = (level - 1) * verticalSpacing + nodeWidth / 2;
      const x2 = nodeCenter;
      const y2 = level * verticalSpacing;
    
      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
      lineElement.style.left = `${x1}px`;
      lineElement.style.top = `${y1}px`;
      lineElement.style.width = `${length}px`;
      lineElement.style.height = '2px';
      lineElement.style.transform = `rotate(${angle}deg)`;
    
      treeInner.appendChild(lineElement);
    }

    const childWidth = width / 2;
    positionNode(node.left, level + 1, position * 2, leftBoundary, leftBoundary + childWidth, nodeCenter);
    positionNode(node.right, level + 1, position * 2 + 1, leftBoundary + childWidth, rightBoundary, nodeCenter);
  }

  positionNode(root);
}

// Logic for hello.html
if (window.location.pathname.includes("hello.html")) {
  document.getElementById("visualizeButton").addEventListener("click", function () {
    const inputArray = document.getElementById("arrayInput").value;
    const parsedArray = JSON.parse(inputArray);
    if (parsedArray.length > 20) {
      const data = encodeURIComponent(JSON.stringify(parsedArray));
      chrome.tabs.create({ url: `visualization.html?data=${data}` });
    } else {
      visualizeTree(parsedArray);
      document.getElementById("inputPage").style.display = "none";
      document.getElementById("visualizationPage").style.display = "block";
    }
  });

  document.getElementById("backButton").addEventListener("click", function () {
    document.getElementById("visualizationPage").style.display = "none";
    document.getElementById("inputPage").style.display = "flex";
    const treeInner = document.getElementById("treeInner");
    if (treeInner) {
      treeInner.innerHTML = "";
    }
  });

  if (document.getElementById("treeInner")) {
    document.getElementById("treeInner").innerHTML = "";
  }

  document.getElementById("arrayInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("visualizeButton").click();
    }
});
}

// Logic for visualization.html
if (window.location.pathname.includes("visualization.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const inputArray = JSON.parse(params.get("data"));

    if (inputArray) {
      visualizeTree(inputArray);
    } else {
      document.getElementById("treeInner").innerHTML = "<p>Error: No data to visualize</p>";
    }
  });
}

//Logic for zooming and panning
document.addEventListener("DOMContentLoaded", () => {
  let isPanning = false;
  let startX, startY;
  let offsetX = 0, offsetY = 0;
  let scale = 1;

  const zoomStep = 0.1;
  const minScale = 0.5;
  const maxScale = 3;

  const treeInner = document.getElementById("treeInner");
  const treeContainer = document.getElementById("treeContainer");

  // Zoom logic
  treeContainer.addEventListener("wheel", (event) => {
    event.preventDefault();

    if (event.deltaY < 0) {
      scale = Math.min(maxScale, scale + zoomStep); // Zoom in
    } else {
      scale = Math.max(minScale, scale - zoomStep); // Zoom out
    }

    treeInner.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  });

  // Pan logic
  treeContainer.addEventListener("mousedown", (event) => {
    isPanning = true;
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
    treeContainer.style.cursor = "grabbing";
  });

  treeContainer.addEventListener("mousemove", (event) => {
    if (!isPanning) return;

    offsetX = event.clientX - startX;
    offsetY = event.clientY - startY;

    treeInner.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  });

  treeContainer.addEventListener("mouseup", () => {
    isPanning = false;
    treeContainer.style.cursor = "default";
  });

  treeContainer.addEventListener("mouseleave", () => {
    isPanning = false;
  });
});

