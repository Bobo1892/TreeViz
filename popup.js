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

// function visualizeTree(array) {
//   const treeContainer = document.getElementById("treeContainer");
//   treeContainer.innerHTML = "";
//   const root = buildTreeFromArray(array);
  
//   if (!root) {
//     treeContainer.innerHTML = "<p>No tree to visualize</p>";
//     return;
//   }
  
//   const queue = [{ node: root, level: 0, position: 0 }];
//   const nodeSpacing = 60;
//   const verticalSpacing = 100;

//   while (queue.length > 0) {
//     const { node, level, position} = queue.shift();

//     const maxNodesAtLevel = Math.pow(2, level);
//     const horizontalPosition = (position + 1) * (treeContainer.clientWidth / (maxNodesAtLevel + 1));

//     const nodeElement = document.createElement("div");
//     nodeElement.className = "tree-node";
//     nodeElement.style.position = 'absolute';
//     nodeElement.style.top = `${level * verticalSpacing}px`;
//     nodeElement.textContent = node.val;
    
//     treeContainer.appendChild(nodeElement);

//     nodeElement.style.left = `${horizontalPosition - (nodeElement.offsetWidth / 2)}px`;
    
//     if (node.left) queue.push({ node: node.left, level: level + 1, position: position * 2 });
//     if (node.right) queue.push({ node: node.right, level: level + 1, position: position * 2 + 1 });
//     }
//   }

function visualizeTree(array) {
  const treeContainer = document.getElementById("treeContainer");
  treeContainer.innerHTML = "";
  const root = buildTreeFromArray(array);

  if (!root) {
    treeContainer.innerHTML = "<p>No tree to visualize</p>";
    return;
  }

  const queue = [{ node: root, level: 0, position: 0 }];
  const levelWidth = {};
  const nodeSpacing = 60;
  const verticalSpacing = 100;

  // First pass: determine the width of each level
  let maxLevel = 0;
  queue.forEach(item => {
    maxLevel = Math.max(maxLevel, item.level);
    levelWidth[item.level] = (levelWidth[item.level] || 0) + 1;
  });

  const totalWidth = Math.pow(2, maxLevel) * nodeSpacing;
  treeContainer.style.width = `${totalWidth}px`;

  while (queue.length > 0) {
    const { node, level, position } = queue.shift();

    const horizontalPosition = (position + 0.5) * (totalWidth / levelWidth[level]);

    const nodeElement = document.createElement("div");
    nodeElement.className = "tree-node";
    nodeElement.style.position = 'absolute';
    nodeElement.style.top = `${level * verticalSpacing}px`;
    nodeElement.textContent = node.val;

    treeContainer.appendChild(nodeElement);

    nodeElement.style.left = `${horizontalPosition - (nodeElement.offsetWidth / 2)}px`;

    if (node.left) queue.push({ node: node.left, level: level + 1, position: position * 2 });
    if (node.right) queue.push({ node: node.right, level: level + 1, position: position * 2 + 1 });
  }
}