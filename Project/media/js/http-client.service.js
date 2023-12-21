export class HttpClient {
  constructor() {
    this._request = null;
  }

  get(url, callback, contentType = "application/json") {
    const request = this._createPreparedRequest("GET", url, contentType);

    return this._sendRequest(request, null, callback);
  }

  post(url, data, callback, contentType = "application/json") {
    contentType = this._getContentType(data, contentType);
    const request = this._createPreparedRequest("POST", url, contentType);

    return this._sendRequest(request, data, callback);
  }

  delete(url, data, callback, contentType = "application/json") {
    contentType = this._getContentType(data, contentType);
    const request = this._createPreparedRequest("DELETE", url, contentType);

    return this._sendRequest(request, data, callback);
  }

  patch(url, data, callback, contentType = "application/json") {
    contentType = this._getContentType(data, contentType);
    const request = this._createPreparedRequest("PATCH", url, contentType);

    return this._sendRequest(request, data, callback);
  }

  /**
   * Abort running Request
   *
   * @returns {*}
   */
  abort() {
    if (this._request) {
      return this._request.abort();
    }
  }

  _registerOnLoaded(request, callback) {
    if (!callback) {
      return;
    }

    request.addEventListener("loadend", () => {
      callback(request.responseText, request);
    });
  }

  _sendRequest(request, data, callback) {
    this._registerOnLoaded(request, callback);
    request.send(data);
    return request;
  }

  _getContentType(data, contentType) {
    if (data instanceof FormData) {
      contentType = false;
    }

    return contentType;
  }

  _createPreparedRequest(type, url, contentType) {
    this._request = new XMLHttpRequest();

    this._request.open(type, url);
    this._request.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    if (contentType) {
      this._request.setRequestHeader("Content-type", contentType);
    }

    return this._request;
  }
}
