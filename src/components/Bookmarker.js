/*global chrome*/

import "./Bookmarker.css";

import { useEffect, useState } from "react";
import getYouTubeID from "get-youtube-id";
var getYoutubeTitle = require("get-youtube-title-await");

const Bookmarker = ({ parentId }) => {
  const [items, setItems] = useState([]);
  const [change, setChange] = useState(false);

  useEffect(() => {
    chrome.bookmarks.getSubTree(parentId, function (bookmarks) {
      setItems([...bookmarks[0].children]);
    });
  }, [parentId, change]);

  chrome.bookmarks.onCreated.addListener(function () {
    setChange(!change);
  });

  const checkUrl = (url) => {
    let flag = false;
    items.map((item) => {
      if (item.url === url) {
        flag = true;
      }
    });
    return flag;
  };

  const removeBookmark = (id) => {
    chrome.bookmarks.remove(id);
    const remainingItems = items.filter((item) => {
      return id !== item.id;
    });
    setItems(remainingItems);
  };
  return (
    <div className="container">
      <header className="header-section">
        <h2>Bookmarker</h2>
        <button
          className="btn"
          onClick={() => {
            chrome.tabs.query(
              {
                active: true,
                windowId: chrome.windows.WINDOW_ID_CURRENT,
              },
              function (tabs) {
                let url = tabs[0].url;
                if (checkUrl(url)) {
                  alert("This Link is already exists");
                  return;
                }
                if (url === "https://www.youtube.com/") {
                  chrome.bookmarks.create({
                    parentId: parentId,
                    url: url,
                    title: "youtube home page",
                  });
                } else {
                  let id = getYouTubeID(url);
                  getYoutubeTitle(
                    id,
                    "AIzaSyBazFarwuclT11lJyIxNvqhhtjEDxxXy9o",
                    function (err, title) {
                      chrome.bookmarks.create({
                        parentId: parentId,
                        url: url,
                        title: title,
                      });
                    }
                  );
                }
              }
            );
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 mx-auto text-white plus-svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v12m6-6H6"
            />
          </svg>
        </button>
      </header>
      <ul>
        {items.length > 0 ? (
          items.map((item) => (
            <li>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
              <div className="button-div">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="trash-svg"
                  onClick={() => {
                    removeBookmark(item.id);
                  }}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </div>
            </li>
          ))
        ) : (
          <div className="error-handle">No Link Found</div>
        )}
      </ul>
    </div>
  );
};

export default Bookmarker;
