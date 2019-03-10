$(document).ready(function() {
  $('.sidenav').sidenav();

  $('.modal').modal();

  $(document).on("click", ".save-button", function() {
    const articleId = $(this).attr("data-id");
    let queryURL = "/api/saved-articles/" + articleId;
    console.log(queryURL);
    $.ajax({
      method: "PUT",
      url: queryURL
    }).then(data => {
      console.log(data);
      window.location.href = "/saved-articles";
    });
  });

  $(document).on("click", "#scrape-link", function() {
    $.ajax({
      method: "GET",
      url: "/api/scrape"
    }).then(data => {
      console.log(data);
      window.location.href = "/";
    });
  });

  $(document).on("click", "#article-delete", function() {
    $.ajax({
      method: "DELETE",
      url: "/api/articles"
    }).then(data => {
      console.log(data);
      window.location.href = "/";
    });
  });

  $(document).on("click", ".add-note", function() {
    const articleId = $(this).attr("data-id");
    $("#modal-id").text("Add note for article: " + articleId);
    $(document).on("click", "#modal-submit", function(event) {
      event.preventDefault();
      const noteOb = {
        title: $("#note-title").val().trim(),
        body: $("#note-body").val().trim()
      };
      let queryURL = "/api/articles/" + articleId;
      $.ajax({
        method: "POST",
        url: queryURL,
        data: noteOb
      }).then(data => {
        console.log(data);
        window.location.href = "/articles/" + articleId;
      });
    });
  });
});