"use client"

import { useState, useEffect, useRef } from "react"
import { initAnimations } from "../../utils/animations"

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("starters")
  const [isChangingCategory, setIsChangingCategory] = useState(false)
  const [displayedCategory, setDisplayedCategory] = useState("starters")
  const [isMobile, setIsMobile] = useState(false)
  const videoRef = useRef(null)
  const videoInitialized = useRef(false)
  const menuItemsRef = useRef(null)
  const lastScrollY = useRef(0)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Initial check
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Enhanced video handling - only initialize once
  useEffect(() => {
    if (!videoRef.current || videoInitialized.current) return

    const video = videoRef.current
    videoInitialized.current = true

    // Ensure video plays
    const playVideo = () => {
      if (video.paused) {
        video.play().catch((err) => console.log("Video play error:", err))
      }
    }

    // Try to play video immediately
    playVideo()

    // Also try when metadata is loaded
    video.addEventListener("loadedmetadata", playVideo)

    // And when enough data is available
    video.addEventListener("canplay", playVideo)

    // Handle visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        playVideo()
      }
    })

    return () => {
      video.removeEventListener("loadedmetadata", playVideo)
      video.removeEventListener("canplay", playVideo)
      document.removeEventListener("visibilitychange", playVideo)
    }
  }, []) // Empty dependency array ensures this only runs once

  // Initialize animations and re-run when category changes
  useEffect(() => {
    // Short delay to ensure DOM is updated
    const animationTimer = setTimeout(() => {
      // Re-initialize animations to catch new menu items
      initAnimations()
    }, 350) // Slightly longer than the fade transition

    return () => clearTimeout(animationTimer)
  }, [displayedCategory])

  // Helper function to check if element is in viewport
  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
  }

  const menuCategories = [
    { id: "starters", name: "Appetizers" },
    { id: "mains", name: "Main Dishes" },
    { id: "desserts", name: "Desserts" },
    { id: "drinks", name: "Beverages" },
  ]

  const menuItems = {
    starters: [
      {
        name: "Nem Nuong",
        description: "Grilled pork skewers marinated in lemongrass and Khmer spices, served with pickled vegetables",
        price: "$12",
        image: "/images/nemnuong.jpg",
      },
      {
        name: "Pleah Sach Ko",
        description: "Traditional Khmer beef ceviche with lime juice, fish sauce, and fresh herbs",
        price: "$14",
        image: "/images/pleahsachko.jpg",
      },
      {
        name: "Num Krok",
        description: "Crispy rice flour and coconut dumplings with green onions and a sweet-savory dipping sauce",
        price: "$10",
        image: "/images/numkrok.jpg",
      },
    ],
    mains: [
      {
        name: "Amok Trey",
        description:
          "Cambodia's national dish - steamed fish curry with coconut milk and kroeung spice paste in banana leaf",
        price: "$24",
        image: "/images/amok.jpg",
      },
      {
        name: "Khor Sach Chrouk",
        description: "Caramelized pork belly slow-cooked in palm sugar, fish sauce, and Kampot pepper",
        price: "$22",
        image: "/images/khor.jpg",
      },
      {
        name: "Somlor Machu Kreung",
        description: "Traditional sour soup with morning glory, pineapple, and your choice of fish or chicken",
        price: "$18",
        image: "/images/somlor.jpg",
      },
    ],
    desserts: [
      {
        name: "Num Ansom Chek",
        description: "Sticky rice and banana wrapped in banana leaf, steamed and served with coconut cream",
        price: "$8",
        image: "/images/ansom.jpg",
      },
      {
        name: "Sankya Lapov",
        description: "Traditional pumpkin custard made with coconut milk and palm sugar",
        price: "$9",
        image: "/images/sankya.jpg",
      },
      {
        name: "Chek Ktih",
        description: "Caramelized bananas in coconut milk with tapioca pearls and sesame seeds",
        price: "$7",
        image: "/images/chek.jpg",
      },
    ],
    drinks: [
      {
        name: "Teuk Ampou",
        description: "Fresh sugar cane juice with lime and a hint of salt",
        price: "$6",
        image: "/images/terk.jpg",
      },
      {
        name: "Teuk Krolok",
        description: "Traditional Cambodian iced coffee with sweetened condensed milk",
        price: "$5",
        image: "/images/mixfruitsmoothie.jpg",
      },
      {
        name: "Sra Sor",
        description: "House-made rice wine infused with local herbs and spices",
        price: "$8",
        image: "/images/whitewhiskey.jpg",
      },
    ],
  }

  // Handle category change without affecting video
  const handleCategoryChange = (categoryId) => {
    if (activeCategory !== categoryId) {
      setIsChangingCategory(true)
      setActiveCategory(categoryId)

      // Wait for fade-out animation to complete before changing displayed items
      setTimeout(() => {
        setDisplayedCategory(categoryId)
        // Then start fade-in animation
        setTimeout(() => {
          setIsChangingCategory(false)

          // Force animation on new items
          if (menuItemsRef.current) {
            const newItems = menuItemsRef.current.querySelectorAll(".menu-item")
            newItems.forEach((item, index) => {
              // Remove and re-add the class to force animation
              item.classList.remove("animated")
              // Staggered delay for smoother appearance
              setTimeout(() => {
                item.classList.add("animated")
              }, 50 * index)
            })
          }
        }, 50)
      }, 300)
    }
  }

  return (
    <section id="menu" className="menu-section">
      {/* Background Video */}
      <div className="menu-background-video">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="video-element"
          poster="/images/menu-poster.jpg"
        >
          <source src="/video/menu.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="menu-container">
        <div className="section-header text-center">
          <span className="subtitle animate-on-scroll fade-up">Khmer Culinary Delights</span>
          <h2 className="animate-on-scroll fade-up delay-200">Our Menu</h2>
          <p className="animate-on-scroll fade-up delay-300">
            Explore our authentic Cambodian dishes crafted with traditional techniques and the finest local ingredients
          </p>
        </div>

        <div className="menu-categories animate-on-scroll fade-up delay-400">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              className={`menu-category-btn ${activeCategory === category.id ? "active" : ""}`}
              onClick={() => handleCategoryChange(category.id)}
              aria-label={`View ${category.name}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div ref={menuItemsRef} className={`menu-items ${isChangingCategory ? "items-fading" : ""}`}>
          {menuItems[displayedCategory] &&
            menuItems[displayedCategory].map((item, index) => (
              <div
                key={`${displayedCategory}-${index}`}
                className="menu-item animate-on-scroll fade-up"
                style={{ animationDelay: `${50 * index}ms` }}
              >
                <div className="menu-item-img">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} loading="lazy" />
                </div>
                <div className="menu-item-content">
                  <div className="menu-item-header">
                    <h3 className="menu-item-name">{item.name}</h3>
                    <span className="menu-item-price">{item.price}</span>
                  </div>
                  <p className="menu-item-description">{item.description}</p>
                </div>
              </div>
            ))}
        </div>

        <div className="menu-cta text-center animate-on-scroll fade-up delay-800">
          <a href="#reservation" className="btn btn-primary">
            Reserve a Table
          </a>
          <a href="/full-menu.pdf" className="btn btn-secondary">
            View Full Menu
          </a>
        </div>
      </div>
    </section>
  )
}

export default Menu
