function route(handle, pathname) {
  console.log("About to route a request for " + pathname);
 
  // Check if a request handler for the given pathname exists
  if (typeof handle[pathname] === 'function') {
    handle[pathname](); // handle this pathname
  } else {
    console.log("No request handler found for " + pathname);
  }
}

exports.route = route;
