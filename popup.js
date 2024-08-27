document.getElementById("visualizeButton").addEventListener("click", function() {
    const inputArray = document.getElementById("arrayInput").value;
    const parsedArray = JSON.parse(inputArray);
    visualizeTree(parsedArray);
    document.getElementById("inputPage").style.display = "none";
    document.getElementById("visualizationPage").style.display = "block";
  });

  document.getElementById("backButton").addEventListener("click", function() {
    document.getElementById("visualizationPage").style.display = "none";
    document.getElementById("inputPage").style.display = "block";

    document.getElementById("treeContainer").innerHTML = "";
});

function TreeNode(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

function buildTreeFromArray(array) {
  if (array.length === 0 || array[0] === null) return null;
  let root = new TreeNode(array[0]);
  let queue = [root];
  let i = 1;

  while (i < array.length) {
    let currentNode = queue.shift();
    if (array[i] !== null) {
      currentNode.left = new TreeNode(array[i]);
      queue.push(currentNode.left);
    }
    i++;

    if (i >= array.length) break;
    if (array[i] !== null) {
      currentNode.right = new TreeNode(array[i]);
      queue.push(currentNode.right);
    }
    i++;
  }
  
  return root;
}

function visualizeTree(array) {
  const treeContainer = document.getElementById("treeContainer");
  treeContainer.innerHTML = "";
  const root = buildTreeFromArray(array);

  if (!root) {
    treeContainer.innerHTML = "<p>No tree to visualize</p>";
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
  treeContainer.style.width = `${treeWidth}px`;

  function positionNode(node, level = 0, position = 0, leftBoundary = 0, rightBoundary = treeWidth, parentCenter = null) {
    if (!node) return;

    const nodeElement = document.createElement("div");
    nodeElement.className = "tree-node";
    nodeElement.textContent = node.val;

    const width = rightBoundary - leftBoundary;
    const nodeCenter = leftBoundary + width / 2;

    nodeElement.style.left = `${nodeCenter - nodeWidth / 2}px`;
    nodeElement.style.top = `${level * verticalSpacing}px`;

    treeContainer.appendChild(nodeElement);

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
    
      treeContainer.appendChild(lineElement);
    }

    const childWidth = width / 2;
    positionNode(node.left, level + 1, position * 2, leftBoundary, leftBoundary + childWidth, nodeCenter);
    positionNode(node.right, level + 1, position * 2 + 1, leftBoundary + childWidth, rightBoundary, nodeCenter);
  }

  positionNode(root);
}
