const useTraverseTree = () => {
  const insertNode = function insertNode(
    tree: any,
    folderId: any,
    item: any,
    isFolder: any
  ) {
    // If the current node is the one to insert into, make a shallow copy
    if (tree.id === folderId && tree.isFolder) {
      const newNode: any = {
        id: new Date().getTime(),
        name: item,
        isFolder: isFolder,
        items: [],
      };

      // Return a new tree structure by copying the existing tree and adding the new node
      return {
        ...tree,
        items: [newNode, ...tree.items], // Create a new array with the new node
      };
    }

    // Recursively traverse the tree and return the updated tree structure
    const latestNode = tree.items.map((ob: any) => {
      return insertNode(ob, folderId, item, isFolder);
    });

    // Return a new tree structure with the updated items
    return { ...tree, items: latestNode };
  };

  return { insertNode };
};

export default useTraverseTree;
