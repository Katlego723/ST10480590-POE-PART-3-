/* =====================================
   BARAX CLOTHING WEBSITE - JAVASCRIPT
   ===================================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const CONTACT_EMAIL = "info@baraxofficial.co.za";

    /* 1. ADD STYLES FOR JAVASCRIPT ELEMENTS */

    const style = document.createElement("style");

    style.textContent = `
        .barax-status {
            margin: 12px auto;
            padding: 12px;
            max-width: 700px;
            border-radius: 6px;
            background: #fff4df;
            color: #222;
            border-left: 4px solid orange;
        }

        .barax-search {
            display: block;
            max-width: 600px;
            width: 90%;
            margin: 18px auto;
            padding: 12px;
            border: 1px solid #999;
            border-radius: 6px;
            font-size: 1rem;
        }

        .barax-button {
            display: inline-block;
            padding: 10px 16px;
            margin: 6px 4px;
            border: 0;
            border-radius: 5px;
            background: orange;
            color: #111;
            cursor: pointer;
            font-weight: bold;
        }

        .barax-button:focus,
        .barax-search:focus,
        input:focus,
        select:focus,
        textarea:focus {
            outline: 3px solid #222;
            outline-offset: 2px;
        }

        .barax-lightbox {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: rgba(0, 0, 0, 0.9);
        }

        .barax-lightbox[hidden] {
            display: none;
        }

        .barax-lightbox img {
            max-width: 90vw;
            max-height: 82vh;
            object-fit: contain;
            background: white;
            border-radius: 6px;
        }

        .barax-lightbox-inner {
            position: relative;
            text-align: center;
            color: white;
        }

        .barax-lightbox-close {
            position: absolute;
            top: -42px;
            right: 0;
            background: white;
            color: black;
            border: 0;
            border-radius: 4px;
            padding: 8px 12px;
            cursor: pointer;
        }

        img.barax-clickable {
            cursor: zoom-in;
        }

        .barax-no-results {
            font-weight: bold;
            color: #8b1d1d;
            text-align: center;
            margin: 15px auto;
        }
    `;

    document.head.appendChild(style);

    /* 2. DISPLAY FEEDBACK MESSAGES */

    function addStatus(form, message, isError) {
        let status = form.querySelector(".barax-status");

        if (!status) {
            status = document.createElement("p");
            status.className = "barax-status";
            status.setAttribute("role", "status");
            status.setAttribute("aria-live", "polite");
            form.appendChild(status);
        }

        status.textContent = message;
        status.style.borderLeftColor = isError
            ? "#b00020"
            : "orange";

        status.hidden = false;
    }

    /* 3. HIGHLIGHT THE CURRENT NAVIGATION PAGE */

    const currentFile =
        (window.location.pathname.split("/").pop() || "index.html")
            .toLowerCase();

    document.querySelectorAll("nav a, .navbar a").forEach(function (link) {
        const linkFile = (link.getAttribute("href") || "")
            .split("/")
            .pop()
            .split("?")[0]
            .toLowerCase();

        if (linkFile === currentFile) {
            link.setAttribute("aria-current", "page");
        }
    });
}

    /* 4. AUTOMATIC SLIDESHOW
       The slideshow is controlled by CSS.
       No Pause or Play buttons are created here.
    */

    const slideshow = document.querySelector(".slideshow .slides");

    if (slideshow) {
        slideshow.style.animationPlayState = "running";
    }

    /* 5. PRODUCT SEARCH AND FILTERING */

    const main = document.querySelector("main");

    if (main && /products\.html$/i.test(currentFile)) {
        const productCards = Array.from(
            main.querySelectorAll(
                ".product-item, .product-card, .products > section, main > section"
            )
        ).filter(function (item) {
            return item.querySelector("h3") &&
                   item.querySelector("img");
        });

        if (
            productCards.length > 0 &&
            !document.querySelector("#barax-product-search")
        ) {
            const heading = main.querySelector("h2");
            const search = document.createElement("input");

            search.type = "search";
            search.className = "barax-search";
            search.id = "barax-product-search";
            search.placeholder =
                "Search products by name or description...";
            search.setAttribute(
                "aria-label",
                "Search clothing products"
            );

            if (heading) {
                heading.insertAdjacentElement("afterend", search);
            } else {
                main.prepend(search);
            }

            const count = document.createElement("p");
            count.setAttribute("aria-live", "polite");
            count.style.textAlign = "center";

            search.insertAdjacentElement("afterend", count);

            const noResults = document.createElement("p");
            noResults.className = "barax-no-results";
            noResults.textContent =
                "No products match your search. Try another word.";
            noResults.hidden = true;

            count.insertAdjacentElement("afterend", noResults);

            function filterProducts() {
                const query = search.value.trim().toLowerCase();
                let visible = 0;

                productCards.forEach(function (card) {
                    const matches = card.textContent
                        .toLowerCase()
                        .includes(query);

                    card.hidden = !matches;

                    const next = card.nextElementSibling;

                    if (next && next.tagName === "HR") {
                        next.hidden = !matches;
                    }

                    if (matches) {
                        visible++;
                    }
                });

                count.textContent = visible +
                    (visible === 1
                        ? " product found"
                        : " products found");

                noResults.hidden = visible !== 0;
            }

            search.addEventListener("input", filterProducts);
            filterProducts();
        }
    }

    /* 6. IMAGE GALLERY LIGHTBOX */

    const lightboxImages = Array.from(
        document.querySelectorAll("main img, .slideshow img")
    );

    if (lightboxImages.length > 0) {
        const lightbox = document.createElement("div");

        lightbox.className = "barax-lightbox";
        lightbox.hidden = true;
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-label", "Image preview");

        const inner = document.createElement("div");
        inner.className = "barax-lightbox-inner";

        const close = document.createElement("button");
        close.type = "button";
        close.className = "barax-lightbox-close";
        close.textContent = "Close X";
        close.setAttribute("aria-label", "Close image preview");

        const largeImage = document.createElement("img");
        largeImage.alt = "";

        const caption = document.createElement("p");
        caption.style.color = "white";
        caption.style.marginTop = "10px";

        inner.append(close, largeImage, caption);
        lightbox.appendChild(inner);
        document.body.appendChild(lightbox);

        let lastFocusedImage = null;

        function closeLightbox() {
            lightbox.hidden = true;
            document.body.style.overflow = "";

            if (lastFocusedImage) {
                lastFocusedImage.focus();
            }
        }

        function openImage() {
            lastFocusedImage = this;

            largeImage.src = this.currentSrc || this.src;
            largeImage.alt = this.alt || "Enlarged image";
            caption.textContent = this.alt || "Image preview";

            lightbox.hidden = false;
            document.body.style.overflow = "hidden";
            close.focus();
        }

        lightboxImages.forEach(function (img) {
            img.classList.add("barax-clickable");
            img.setAttribute("tabindex", "0");
            img.setAttribute("role", "button");

            img.setAttribute(
                "aria-label",
                "Enlarge image: " + (img.alt || "image")
            );

            img.addEventListener("click", openImage);

            img.addEventListener("keydown", function (event) {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    openImage.call(img);
                }
            });
        });

        close.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (!lightbox.hidden && event.key === "Escape") {
                closeLightbox();
            }
        });
    }

    /* 7. ENQUIRY FORM VALIDATION AND EMAIL PREPARATION */

    const enquiryName = document.querySelector("#name");
    const enquiryForm = enquiryName
        ? enquiryName.closest("form")
        : null;

    if (enquiryForm) {
        const nameField = enquiryForm.querySelector("#name");
        const emailField = enquiryForm.querySelector("#email");
        const productField = enquiryForm.querySelector("#product");
        const sizeField = enquiryForm.querySelector("#size");
        const messageField = enquiryForm.querySelector("#message");

        [
            nameField,
            emailField,
            productField,
            sizeField,
            messageField
        ].forEach(function (field) {
            if (field) {
                field.required = true;
            }
        });

        if (nameField) {
            nameField.minLength = 2;
        }

        if (messageField) {
            messageField.minLength = 10;
            messageField.placeholder =
                "Type your enquiry here (at least 10 characters)";
        }

        let quantityField = enquiryForm.querySelector("#quantity");

        if (!quantityField && sizeField) {
            const label = document.createElement("label");
            label.htmlFor = "quantity";
            label.textContent = "Quantity:";

            quantityField = document.createElement("input");
            quantityField.type = "number";
            quantityField.id = "quantity";
            quantityField.name = "quantity";
            quantityField.min = "1";
            quantityField.max = "20";
            quantityField.value = "1";
            quantityField.required = true;

            sizeField.insertAdjacentElement("afterend", label);
            label.insertAdjacentElement("afterend", quantityField);
        }

        enquiryForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!enquiryForm.reportValidity()) {
                addStatus(
                    enquiryForm,
                    "Please correct the highlighted fields before submitting.",
                    true
                );
                return;
            }

            const subject =
                "Barax Clothing product enquiry: " +
                (productField ? productField.value : "General enquiry");

            const body = [
                "PRODUCT ENQUIRY",
                "Name: " + (nameField ? nameField.value.trim() : ""),
                "Email: " + (emailField ? emailField.value.trim() : ""),
                "Product: " + (productField ? productField.value : ""),
                "Size: " + (sizeField ? sizeField.value : ""),
                "Quantity: " + (quantityField ? quantityField.value : "1"),
                "Message: " +
                    (messageField ? messageField.value.trim() : "")
            ].join("\n");

            addStatus(
                enquiryForm,
                "Your enquiry has been validated. Your email application " +
                "will open with the enquiry details. Please review and " +
                "send the email to complete submission.",
                false
            );

            window.location.href =
                "mailto:" + CONTACT_EMAIL +
                "?subject=" + encodeURIComponent(subject) +
                "&body=" + encodeURIComponent(body);
        });
    }

    /* 8. CONTACT FORM VALIDATION AND EMAIL PREPARATION */

    const contactName = document.querySelector("#contact-name");

    const contactForm = contactName
        ? contactName.closest("form")
        : null;

    if (contactForm) {
        const email = contactForm.querySelector("#contact-email");
        const message = contactForm.querySelector("#contact-message");

        [contactName, email, message].forEach(function (field) {
            if (field) {
                field.required = true;
            }
        });
    }

        contactName.minLength = 2;

        if (message) {
            message.minLength = 10;
            message.placeholder =
                "Enter your message (at least 10 characters)";
        }

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.reportValidity()) {
                addStatus(
                    contactForm,
                    "Please complete all fields correctly before sending your message.",
                    true
                );
                return;
            }

            const subject = "Message from Barax Clothing website";

            const body = [
                "CONTACT MESSAGE",
                "Name: " + contactName.value.trim(),
                "Email: " + (email ? email.value.trim() : ""),
                "",
                "Message:",
                message ? message.value.trim() : ""
            ].join("\n");

            addStatus(
                contactForm,
                "Your message has been validated. Your email application " +
                "will open with the message prepared. Please review and " +
                "send it to complete submission.",
                false
            );

            window.location.href =
                "mailto:" + CONTACT_EMAIL +
                "?subject=" + encodeURIComponent(subject) +
                "&body=" + encodeURIComponent(body);
        });
