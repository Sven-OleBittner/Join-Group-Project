const BASE_URL = "https://join-solo-uebung-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Fetches data from the specified path in the database
 * @param {string} path - The path to fetch data from (without .json extension)
 * @returns {Promise<Object>} The data retrieved from the database
 */
async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseData = await response.json();
    return responseData;
}

/**
 * Posts new data to the specified path in the database
 * @param {string} path - The path to post data to (without .json extension)
 * @param {Object} data - The data object to post
 * @returns {Promise<void>}
 */
async function postData(path = "", data) {
    await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

/**
 * Updates data at the specified path in the database
 * @param {string} path - The path to update data at (without .json extension)
 * @param {Object} data - The data object to put
 * @returns {Promise<Object>} The response data from the database after the update
 */
async function putData(path = "", data) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    let responseData = await response.json();
    return responseData;
}

/**
 * Deletes data at the specified path in the database
 * @param {string} path - The path to delete data from (without .json extension)
 * @returns {Promise<void>}
 */
async function deleteData(path = "") {
    const response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE"
    });
    if (!response.ok) {
        throw new Error("Failed to delete data");
    };
}