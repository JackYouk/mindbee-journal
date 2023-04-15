import { useEffect, useState, useLayoutEffect } from "react";
import { Gradient } from "@/components/GradientBG";


export default function Home() {

  // page state
  const [step, setStep] = useState(0);

  // prompt states
  const [writingLevel, setWritingLevel] = useState('default');
  const [wordCount, setWordCount] = useState(500);
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [source1, setSource1] = useState('');
  const [source2, setSource2] = useState('');
  const [source3, setSource3] = useState('');

  // Loading state
  const [loading, setLoading] = useState(false);

  // payment state
  const [hasPaid, setHasPaid] = useState(false);

  // click to copy state + function
  const [essayCopied, setEssayCopied] = useState(false);
  const handleCopyEssay = () => {
    setEssayCopied(true);
    const essay = document.body.querySelector('#essay-textarea').value;
    navigator.clipboard.writeText(essay);
    setTimeout(() => setEssayCopied(false), 2000);
  }

  // POST to openai api
  const generateEssay = async (event) => {
    setLoading(true);
    const response = await fetch('/api/ai_generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `Write a ${wordCount} word essay with the following props, adhering to MLA formatting and MLA inlinen citations if sources are provided.
        Create a unique title that captures the content of the essay, and adding a linebreak.
        Generate a bibliography following the essay (using a line break for each citation) adhering to MLA standards, and do not count the word count towards the bibliography.
        Writing Level: ${writingLevel === 'default' ? 'professional' : ''} ${writingLevel === 'low' ? 'average high school student' : ''} ${writingLevel === 'academic' ? 'scholarly and highly sophisticated and nuanced' : ''},
        Context: ${context}, 
        Prompt: ${prompt}, 
        ${source1.trim().length > 0 ? 'Source #1: ' + source1 : ''} ${source2.trim().length > 0 ? ', Source #2: ' + source2 : ''} ${source3.trim().length > 0 ? ', Source #3' + source3 : ''}`
      })
    }).then(response => response.json());
    if (response.essay) {
      // set local storage with response
      localStorage.setItem('essay', response.essay);
      setLoading(false);
    }
  }

  // Stripe payment state + function
  const [checkoutHeader, setCheckoutHeader] = useState('/api/checkout_sessions');
  useEffect(() => {
    if (!writingLevel || !wordCount) return;
    let header = '/api/checkout_sessions?';
    // send payment state to api
    header = header + `level=${writingLevel}&`;
    const wordCost = Math.ceil(wordCount / 500);
    header = header + `wordCost=${wordCost}`;
    setCheckoutHeader(header);
  }, [writingLevel, wordCount]);


  // Check for valid user payment
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setHasPaid(true);
      setStep(2);
    }
    if (query.get('canceled')) {
      setStep(2);
    }
  }, []);

  return (
    <>
      <div className="h-[100dvh] overflow-hidden text-gray-400 w-full flex flex-col justify-center items-center">
        <div className="w-5/6 lg:w-2/3 m-10 p-2 border-2 border-gray bg-white rounded-lg">
          {/* Title */}
          <h1 className="text-2xl font-bold">QuickTemplate101</h1>

          {/* Page 1 - intro page */}
          {step === 0 ? (<>
            <h2 className="text-md">Perfect essays at the most premium prices.</h2>

            <div className="flex flex-row items-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle text-success mr-1" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
              </svg>
              <h3 className="text-sm">100% Plagiarism-Free & Ai Undetectable</h3>
            </div>
            <div className="flex flex-row items-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle text-success mr-1" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
              </svg>
              <h3 className="text-sm">Customizable writing level</h3>
            </div>
            <div className="flex flex-row items-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle text-success mr-1" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
              </svg>
              <h3 className="text-sm">MLA Formatted & bibliography included</h3>
            </div>
            <div className="flex flex-row items-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle text-success mr-1" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
              </svg>
              <h3 className="text-sm">Premium prices @ $1 per 500 words</h3>
            </div>

            <a onClick={() => setStep(1)} className="btn btn-sm mt-4 btn-success w-full md:w-fit text-white">Get Started</a>
          </>) : <></>}

          {/* Page 2 - Prompt user page */}
          {step === 1 ? (<>
            <div className="h-[80dvh] overflow-y-auto">
            <h3 className="text-sm font-bold mt-2">Set Writing Level</h3>
            <div className="flex items-center mt-1">
              <input type="radio" className="radio radio-xs checked:bg-blue-400 mr-1" checked={writingLevel === 'bad'} onClick={() => setWritingLevel('bad')} />
              <label className="label-text">Low Writing Level</label>
            </div>
            <div className="flex items-center mt-1">
              <input type="radio" className="radio radio-xs checked:bg-blue-400 mr-1" checked={writingLevel === 'default'} onClick={() => setWritingLevel('default')} />
              <label className="label-text">Default Writing Level</label>
            </div>
            <div className="flex items-center mt-1">
              <input type="radio" className="radio radio-xs checked:bg-blue-400 mr-1" checked={writingLevel === 'academic'} onClick={() => setWritingLevel('academic')} />
              <label className="label-text">High-Academic Writing Level (+ $5)</label>
            </div>

            <h3 className="text-sm font-bold mt-4">Word Count</h3>
            <p className="text-xs">You will be charged per $1 per 500 words, rounded up (ex: 750 words will be rounded up to 1000).</p>
            <p className="text-xs text-warning">*QuickEssay101 is currently in Beta, and will only draft 500 word essays.</p>
            <input
              type="number"
              placeholder="500"
              className="input input-sm w-20 bg-gray-200 mt-1"
              value={wordCount}
              onChange={e => {if(e.target.value <= 500) setWordCount(e.target.value) }}
            />

            <h3 className="text-sm font-bold mt-4">Context & Prompt</h3>
            <label className="label label-text text-xs">Context</label>
            <input
              type="text"
              placeholder="AP US History Free-Response Question (APUSH FRQ Essay)"
              className="input input-sm w-full bg-gray-200"
              value={context}
              onChange={e => setContext(e.target.value)}
            />
            <label className="label label-text text-xs">Prompt</label>
            <textarea
              type="text"
              placeholder="a. Briefly describe one major difference between Billington’s and Schwantes’ historical interpretations
                of the American West.
                b. Briefly explain how one historical event..."
              className="textarea textarea-sm w-full bg-gray-200"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            ></textarea>

            <h3 className="text-sm font-bold mt-4">Sources (Optional)</h3>
            <p className="text-xs">Please enter in the exact evidence/quote or enter a summary of the source. Additionally, enter the title & author of the source.</p>
            <label className="label label-text text-xs">Source #1</label>
            <textarea
              type="text"
              placeholder="“The rapid expansion of wagework in the United States... Carlos A. Schwantes, historian, “The Concept of the Wageworkers’ Frontier,”
                1987"
              className="textarea textarea-sm w-full bg-gray-200"
              value={source1}
              onChange={e => setSource1(e.target.value)}
            ></textarea>

            <label className="label label-text text-xs">Source #2</label>
            <textarea
              type="text"
              placeholder=""
              className="textarea textarea-sm w-full bg-gray-200"
              value={source2}
              onChange={e => setSource2(e.target.value)}
            ></textarea>

            <label className="label label-text text-xs">Source #3</label>
            <textarea
              type="text"
              placeholder=""
              className="textarea textarea-sm w-full bg-gray-200"
              value={source3}
              onChange={e => setSource3(e.target.value)}
            ></textarea>

            <a
              onClick={() => {
                if(prompt.trim().length === 0) return;
                setStep(2);
                generateEssay();
              }}
              className="btn btn-sm mt-4 btn-success w-full md:w-fit text-white"
            >
              Write Essay
            </a>
            </div>
          </>) : <></>}

          {/* Page 3 - Display ai response with blur if no stripe payment, if paymentshow + make editable+copiable */}
          {step === 2 ? (
            <>
              {loading ? <div className="dot-flashing ml-4 mt-2" /> : (
                <>
                  {hasPaid ? (
                    <>
                      <p className="text-xs mb-4">While it is very unlikely that this essay will be flagged as ai generated or plagiarised, please review the text and make some edits so it is your own work. Enjoy :)</p>
                      <div className="overflow-hidden text-ellipsis">
                        <textarea id="essay-textarea" className="w-full h-[70dvh] bg-white">
                          {'[Your Name]\n[Professor/Teacher]\n[Class/Subject]\n[Date]\n\n' + localStorage.getItem('essay')}
                        </textarea>
                      </div>
                      <a className="btn btn-sm btn-info text-white" onClick={() => handleCopyEssay()}>
                        {!essayCopied ? (
                          <>
                            Copy to clipboard
                          </>
                        ) : (
                          <>
                            Copied!
                          </>
                        )}
                      </a>
                    </>
                  ) : (
                    <div className="h-[80dvh] overflow-y-scroll">
                      <div className="overflow-hidden text-ellipsis">
                        <span className="font-bold">Preview:</span>
                        {localStorage.getItem('essay').slice(0, 500)}...
                      </div>
                      <div className="blockedText relative z-10 overflow-hidden text-ellipsis">
                        {localStorage.getItem('essay').slice(500)}
                        <div class="absolute top-4 w-full flex justify-center z-20 p-4 text-gray-400">
                          {/* submit payment header to stripe api */}
                          <form action={checkoutHeader} method="POST">
                            <section>
                              <button type="submit" role="link" className="btn btn btn-success mt-10 w-full md:w-fit text-white">
                                Buy this essay
                              </button>
                            </section>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : <></>}
        </div>
      </div>
    </>
  );
}