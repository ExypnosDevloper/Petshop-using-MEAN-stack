document.getElementById("demo").addEventListener("click", myFunction);

    function myFunction() {
        var x = document.getElementById("doc");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }