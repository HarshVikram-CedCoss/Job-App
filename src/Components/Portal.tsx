/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { API_ENDPOINT } from "./Constan";

const ITEMS_PER_PAGE = 5;

export default function Portal() {
  const [items, setData] = useState<Array<[]>>([]);
  const [itemIds, setItemIds] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // fetching the portal lists
  async function fetchItemsLists(pageNumber: number) {
    setCurrentPage(pageNumber);
    const response = await fetch(`${API_ENDPOINT}/jobstories.json`);
    const responseData = await response.json();
    setItemIds(responseData);

    // sets the item ids for the current page
    const itemIdsForPage = responseData.slice(
      pageNumber * ITEMS_PER_PAGE,
      pageNumber * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
    console.log(items);
    console.log(itemIdsForPage);

    // fullfilll the first api response so that the data can be rendered properly
    const itemsForPage = await Promise.all(
      itemIdsForPage.map((itemId: number) =>
        fetch(`${API_ENDPOINT}/item/${itemId}.json`)
          .then((response) => response.json())
          .finally(() => {
            setIsLoading(false);
          })
      )
    );
    // previous data stored
    setData([...items, ...itemsForPage]);
  }

  useEffect(() => {
    if (currentPage === 0) fetchItemsLists(currentPage);
  }, [currentPage]);

  if (isLoading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="custom-app">
      <h1 className="custom-title">Hacker News Jobs Board</h1>

      <div>
        <div className="custom-items" role="list">
          {items.map((item: any) => (
            <div className="custom-post" role="listitem">
              <h2 className="custom-post__title">
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.title}
                </a>
              </h2>
              <span className="post">
                By {item.by} · {item.formattedTime}
              </span>
            </div>
          ))}
        </div>
        {items.length > 0 &&
          currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE < itemIds.length && (
            <button
              className={`custom-load-more-button`}
              disabled={isLoading}
              onClick={() => fetchItemsLists(currentPage + 1)}
            >
              {isLoading ? "loading..." : "Load more jobs"}
            </button>
          )}
      </div>
    </div>
  );
}
