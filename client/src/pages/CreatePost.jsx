import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";
import axios from "axios";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response= await fetch('http://localhost:8080/api/v1/dalle',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({prompt:form.prompt}),
        })
        const data=await response.json();
        setForm({...form,photo:`data:image/jpeg;base64,${data.photo}`});

        // const url = "https://open-ai21.p.rapidapi.com/texttoimage2";
        // const options = {
        //   method: "POST",
        //   headers: {
        //     "content-type": "application/json",
        //     "X-RapidAPI-Key":
        //       "cb2b73532cmsh2d9e05a8462a86ap192b89jsnfb1da5506bec",
        //     "X-RapidAPI-Host": "open-ai21.p.rapidapi.com",
        //   },
        //   body: { text: form.prompt },
        // };
        // const response = await fetch(url, options);
        // const data = await response.text();
        // console.log(data);

    //     const url = "https://arimagesynthesizer.p.rapidapi.com/generate";
    //     const options = {
    //       method: "POST",
    //       headers: {
    //         "content-type": "application/x-www-form-urlencoded",
    //         "X-RapidAPI-Key":
    //           "cb2b73532cmsh2d9e05a8462a86ap192b89jsnfb1da5506bec",
    //         "X-RapidAPI-Host": "arimagesynthesizer.p.rapidapi.com",
    //       },
    //       body: new URLSearchParams({
    //         prompt: "dog",
    //         id: "12345",
    //         width: "768",
    //         height: "768",
    //         inferenceSteps: "50",
    //         guidanceScale: "7.5",
    //         img2img_strength: "0.75",
    //       }),
    //     };

        
    //       const response = await fetch(url, options);
    //       const result=await response.json();
    //       const b64Response = btoa(result);
    //     //   const result = await response.text();
    //     setForm({...form,photo:`data:image/jpeg;base64,${b64Response}`});
    //       console.log(b64Response);
        
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please enter a prompt");
    }
//     const url = `https://real-time-image-search.p.rapidapi.com/search?query=${form.prompt}&region=us`;
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': 'cb2b73532cmsh2d9e05a8462a86ap192b89jsnfb1da5506bec',
// 		'X-RapidAPI-Host': 'real-time-image-search.p.rapidapi.com'
// 	}
// };

// try {
// 	const response = await fetch(url, options);
// 	const result = await response.json();
// 	console.log(result);
//      setForm({...form,photo: result.data[7].url});

// } catch (error) {
// 	console.error(error);
// }
};

  const handleSubmit = async (e) => {
      e.preventDefault();

      if(form.prompt && form.photo){
        setLoading(true);

        try {
            const response= await fetch(`http://localhost:8080/api/v1/post`,{
              method: 'POST',
              headers:{
                  'Content-Type':'application/json',
              },
              body: JSON.stringify(form),
            })

            await response.json();
            navigate('/');
        } catch (error) {
            alert(error);
        }finally{
            setLoading(false);
        }
      }else{
         alert('Please enter a prompt and generate an image');
      }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(e);
    console.log(form);
  };


  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };
  return (
    <section className="max-w-7xl mx-auto ">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Create imaginative and visually stunning images through DALL-E AI and
          share them with the community
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelname="Your name"
            type="text"
            name="name"
            placeholder="Prashant Dixit"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelname="Prompt"
            type="text"
            name="prompt"
            placeholder= "An Impressionist oil painting of sunflowers in a purple vase…"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div
            className="relative bg-gray-50 border border-gray-300 
                text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center"
          >
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div
                className="absolute inset-0 z-0 flex 
                        justify-center items-center bg-[rgba(0,0,0,0.5)] 
                        rounded-lg"
              >
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5 ">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md
                text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? "Generating.." : "Generate"}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            Once you have created the image you want, you can share it with
            other in the community
          </p>

          <button
            type="submit"
            className="mt-3 text-white  bg-[#6469ff]
                font-medium rounded-md text-sm w-full sm:w-auto  px-5 py-2.5 text-center"
          >
            {loading ? "Sharing..." : "Share with the community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
