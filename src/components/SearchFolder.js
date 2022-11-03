/*global chrome*/

import React, { useEffect, useState } from "react";
import Bookmarker from "./Bookmarker";

const SearchFolder = () => {
  const [parentId, setParentId] = useState();
  function onFulfilled(bookmarkItems) {
    if (bookmarkItems[0] !== undefined) {
      setParentId(bookmarkItems[0].id);
    } else {
      chrome.bookmarks.create(
        {
          parentId: "1",
          title: "youtubeExtension",
        },
        function folder() {
          chrome.bookmarks
            .search("youtubeExtension")
            .then(onFulfilled, onRejected);
        }
      );
    }
  }

  function onRejected(error) {
    console.log(`An error: ${error}`);
  }
  useEffect(() => {
    chrome.bookmarks.search("youtubeExtension").then(onFulfilled, onRejected);
  });
  return (
    <div>
      {parentId !== undefined && <Bookmarker parentId={`${parentId}`} />}
    </div>
  );
};
export default SearchFolder;
