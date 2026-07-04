import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import { Swiper, SwiperSlide } from "swiper/react"

const RatingStars = ReactStars?.default || ReactStars

import "swiper/css"
import "swiper/css/pagination"

import "../../App.css"

import { FaStar } from "react-icons/fa"

import { Pagination, Autoplay } from "swiper/modules"

import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )

        if (data?.success) {
          setReviews(data?.data)
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  return (
    <div className="w-full py-16 text-white">

      {/* Heading */}
      <h2 className="mb-14 text-center text-4xl font-semibold">
        {/* Reviews from other learners */}
      </h2>

      {/* Slider */}
      <div className="mx-auto w-[83%] max-w-[1100px]">

        <Swiper
          spaceBetween={25}
          loop={true}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          modules={[Pagination, Autoplay]}
        >

          {reviews.map((review, i) => (
            <SwiperSlide key={i}>

              <div className="flex min-h-[240px] flex-col justify-between rounded-2xl bg-richblack-800 p-6">
                 
                   <div className="flex flex-1 flex-col justify-center">


                {/* Stars */}
                <div className="mb-6 flex justify-center gap-1 text-yellow-100">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>

                {/* Review */}
                <p className=" text-center text-[18px] leading-8 text-richblack-25">
                  "
                  {review?.review?.split(" ").length > truncateWords
                    ? `${review?.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")}...`
                    : review?.review}
                  "
                </p>

                {/* Bottom User */}
                <div className="mt-8 flex items-center gap-4">

                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt="user"
                    className="h-14 w-14 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="text-lg font-semibold text-richblack-5">
                      {review?.user?.firstName}{" "}
                      {review?.user?.lastName}
                    </h3>

                    <p className="text-sm text-richblack-300">
                      Student
                    </p>
                  </div>

                </div>
                 
                </div>

              </div>

            </SwiperSlide>
          ))}

        </Swiper>

      </div>
    </div>
  )
}

export default ReviewSlider