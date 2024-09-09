import React, { Fragment } from "react";
import Iconify from "../../../backoffice/components/iconify";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import MetaData from "../../components/MetaData";

const Contact = () => {
  return (
    <Fragment>
      <MetaData title={"Contact"} />
      <Navbar />
      <div class="font-[sans-serif] max-w-6xl mx-auto relative overflow-hidden mt-4">

        <div class="grid md:grid-cols-2 gap-8 py-8 px-6">
          <div class="text-center flex flex-col items-center justify-center">
            <img src="../../../../public/assets/contact.webp" class="shrink-0 w-5/6" />
          </div>

          <form class="rounded-tl-3xl rounded-bl-3xl">
            <h2 class="text-2xl underline decoration-green-400 decoration-4 underline-offset-8 font-semibold text-center mb-6">Contact us</h2>
            <div class="max-w-md mx-auto space-y-3 relative">
              <input type='text' placeholder='Name'
                class="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-green-400 focus-within:bg-transparent" />
              <input type='email' placeholder='Email'
                class="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-green-400 focus-within:bg-transparent" />
              <input type='email' placeholder='Phone No.'
                class="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-green-400 focus-within:bg-transparent" />
              <textarea placeholder='Message' rows="6"
                class="w-full bg-gray-100 rounded-md px-4 text-sm pt-3 outline-green-400 focus-within:bg-transparent"></textarea>
              <input id="checkbox1" type="checkbox"
                class="w-4 h-4 mr-3 accent-green-400" />
              <label for="checkbox1" class="text-sm text-gray-500">I agree to the <a href="javascript:void(0);" class="underline">Terms and Conditions</a> and <a href="javascript:void(0);" class="underline">Privacy Policy</a></label>
              <button type='button'
                class="text-white w-full relative bg-[#8DC63F] shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400 rounded-md text-sm px-6 py-3 !mt-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill='#fff' class="mr-2 inline" viewBox="0 0 548.244 548.244">
                  <path fill-rule="evenodd" d="M392.19 156.054 211.268 281.667 22.032 218.58C8.823 214.168-.076 201.775 0 187.852c.077-13.923 9.078-26.24 22.338-30.498L506.15 1.549c11.5-3.697 24.123-.663 32.666 7.88 8.542 8.543 11.577 21.165 7.879 32.666L390.89 525.906c-4.258 13.26-16.575 22.261-30.498 22.338-13.923.076-26.316-8.823-30.728-22.032l-63.393-190.153z" clip-rule="evenodd" data-original="#000000" />
                </svg>
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
      <hr className="m-4" />
      <div
        class="my-8 py-6 grid md:grid-cols-2 items-center overflow-hidden max-w-6xl mx-auto font-[sans-serif]">
        <div class="p-8">
          <h2 class="text-2xl font-semibold underline decoration-green-400 decoration-4 underline-offset-8">Get In Touch</h2>
          <p class="text-sm text-gray-500 mt-4 leading-relaxed">Moroccan E-shop provides all kinds of organic goods, and our services are designed and made to fit into your healthy lifestyles.</p>
          <ul class="mt-8 mb-6 md:mb-0">
            <li class="flex">
              <div class="flex h-10 w-10 items-center justify-center rounded bg-[#8DC63F] text-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" class="h-6 w-6">
                  <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                  <path
                    d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z">
                  </path>
                </svg>
              </div>
              <div class="ml-4 mb-4">
                <h3 class="mb-2 text-lg font-medium leading-6 text-gray-900">Our Address
                </h3>
                <p class="text-gray-500">Centre ville, Casablanca</p>
                <p class="text-gray-500">Morocco</p>
              </div>
            </li>
            <li class="flex">
              <div class="flex h-10 w-10 items-center justify-center rounded bg-[#8DC63F] text-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" class="h-6 w-6">
                  <path
                    d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2">
                  </path>
                  <path d="M15 7a2 2 0 0 1 2 2"></path>
                  <path d="M15 3a6 6 0 0 1 6 6"></path>
                </svg>
              </div>
              <div class="ml-4 mb-4">
                <h3 class="mb-2 text-lg font-medium leading-6 text-gray-900">Contact
                </h3>
                <p class="text-gray-500">Mobile: 0608345687</p>
                <p class="text-gray-500">Mail: contact@greenville.ma</p>
              </div>
            </li>
            <li class="flex">
              <div class="flex h-10 w-10 items-center justify-center rounded bg-[#8DC63F] text-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" class="h-6 w-6">
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                  <path d="M12 7v5l3 3"></path>
                </svg>
              </div>
              <div class="ml-4 mb-4">
                <h3 class="mb-2 text-lg font-medium leading-6 text-gray-900">Working
                  hours</h3>
                <p class="text-gray-500">Monday - Friday: 08:00 - 19:00</p>
                <p class="text-gray-500">Saturday &amp; Sunday: 08:00 - 12:00</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="z-10 relative h-full">
          <iframe src="https://maps.google.com/maps?q=casablanca&t=&z=13&ie=UTF8&iwloc=&output=embed"
            class="left-0 top-0 h-full w-full max-w-lg rounded-lg" frameborder="0"
            allowfullscreen></iframe>
        </div>
      </div>

      <Footer />
    </Fragment>
  );
};

export default Contact;
