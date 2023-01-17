// ****************************************************************************
// *                                 Constants                                *
// ****************************************************************************

var PROL_ID = jsPsych.data.getURLVariable('PROLIFIC_PID');

jsPsych.data.addProperties({
  subject: Math.random().toString(36).slice(2), 
  date: Date(),
  prol_id: PROL_ID,
});

const DEBUGMODE        = false;                    // whether to skip instructions + encoding (for debugging) 
const N_ATTRACT_LEVS   = 5;                        // number of attractiveness levels
const QUAL_LEVS        = [11,12,13,14,15,16];      // qualification levels
const NOBS             = 4;                        // n observations per cell
const N_ENCODE         = 2;                        // number of encoding repetitions
const CHOICE_TIME      = 10000                     // response deadline
const ENCODE_TIME      = 2000;                     // amount of time each profile appears during encoding phase (ms.)
const LOCKOUT_TIME     = 500;                      // amount of time before a response can be made in choice phase (ms.)
const CHOICE_KEYS      = ['e', 'i'];               // keys to choose decks (choice phase)
const IMG_SIZE         = [175, 175];               // [w,h] of cards (in px.)
const ITI              = 500;                      // iti (in ms.)


// ****************************************************************************
// *                             Define Functions                             *
// ****************************************************************************

function JBTHTML(img, qual, show_prompt=true, size=IMG_SIZE) {
  /**
 * Generates HTML for choice trials, which are two decks side-by-side with a key to press beneath. 
 * @param  {[String]}   img         Image url
 * @param  {[Array]}    qual        Array of qualifications
 * @param  {[Bool]}     show_prompt Whether to show the accept/reject prompts or not
 * @param  {[Array]}    size        Size of the central image 
 * 
 * @return {[String]}   HTML element
 */

  img_html = img=='' ? '' : `<p style="text-align:center;"><img src="${img}" style="width:${size[0]}px;height:${size[1]}px;"></p><br><br>`;
  html = `

  ${img_html}

  <table>
  <tbody align="left">

  <tr>
    <td>Science GPA:</td> 
    <td><p style="visibility: hidden;">blankblank</p></td>
    <td>${qual[0]}</td>
  </tr>

  <tr >
    <td >Humanities GPA:</td> 
    <td></td>
    <td>${qual[1]}</td>
  </tr>

  <tr >
    <td >Recommendation Letter:</td> 
    <td></td>
    <td>${qual[3]}</td>
  </tr>

  <tr >
    <td >Interview Score:</td> 
    <td></td>
    <td>${qual[2]}</td>
  </tr>
  `

  if(show_prompt) {
    html += 
    `<tr >
    <td><p style="visibility: hidden;">blank</p></td>
    <td></td>
    <td><p style="visibility: hidden;">blank</p></td>
  </tr>

   <tr >
    <td><p style="visibility: hidden;">blank</p></td>
    <td></td>
    <td><p style="visibility: hidden;">blank</p></td>
  </tr>

  <tr >
    <td> <img src="${BASE_IMG_URL}Reject.jpg" width=70 height=70> </td> 
    <td></td>
    <td><img src="${BASE_IMG_URL}Accept.jpg" width=70 height=70> </td>
  </tr>`
  };
  
  html += '</table>';

  return html; 

};

GenQual = function(Q, eps=.1, scale=true) {
  /**
 * Generates pseudo-random qualifications for a given profile 
 * @param  {[Float]}   Q         The desired qualification level
 * @param  {[Float]}   eps       The tolerated amount of error between the cumulative generated qualifications and Q
 * @param  {[Bool]}    scale     Should the generated qualificaitons be scaled to their usual scale, or left to be 0-4

 * @return {[Array]}   Array of qualifications
 */

  while(true) { // bad practice, but oh well
    out  = [Math.random()*4, Math.random()*4, Math.random()*4, Math.round(Math.random()*4) ]; 
    pred = out.reduce((s, a) => s + a, 0);

    if(Math.abs(Q - pred) <= eps) break 
  }
  
  if(scale) {
  out[0] = Math.round(out[0]*100)/100;
  out[1] = Math.round(out[1]*100)/100
  out[2] = Math.round((out[2]*25)*100)/100; // for percentages
  out[3] = ['Poor','Fair','Good', 'Excellent'][out[3]-1]; // for rec letter
  };

  return(out);  

};

GetObjSize = function(obj){
 /**
 * Gets number of elements of a js object 
 * @param  {[Object]}   obj    The object
 * @return {[Integer]}  Number of elements
 */

  return(Object.keys(obj).length);
}

// ****************************************************************************
// *                              Define Stimuli                              *
// ****************************************************************************

const BASE_IMG_URL = 'https://raw.githubusercontent.com/seandamiandevine/jbt_cont/main/stim/';
const IMG_FILES = {
  0:['0_166.png', '0_195.png', '0_220.png', '0_415.png', '0_416.png', '0_420.png', '0_441.png', '0_466.png', '0_496.png', '0_498.png', '0_520.png', '0_525.png', '0_585.png', '0_601.png', '0_638.png', '0_667.png', '0_680.png', '0_733.png', '0_756.png', '0_846.png', '0_852.png', '0_913.png', '0_924.png', '0_944.png'],
  1:['1_182.png', '1_251.png', '1_28.png', '1_282.png', '1_339.png', '1_356.png', '1_365.png', '1_444.png', '1_455.png', '1_519.png', '1_606.png', '1_7.png', '1_71.png', '1_820.png', '1_833.png', '1_834.png', '1_836.png', '1_908.png', '1_921.png', '1_956.png', '1_964.png', '1_976.png', '1_984.png', '1_996.png'],
  2:['2_139.png', '2_186.png', '2_256.png', '2_273.png', '2_276.png', '2_409.png', '2_42.png', '2_432.png', '2_434.png', '2_49.png', '2_595.png', '2_617.png', '2_683.png', '2_694.png', '2_731.png', '2_738.png', '2_754.png', '2_763.png', '2_780.png', '2_861.png', '2_866.png', '2_903.png', '2_91.png', '2_914.png'],
  3:['3_14.png', '3_141.png', '3_21.png', '3_266.png', '3_288.png', '3_296.png', '3_347.png', '3_369.png', '3_422.png', '3_504.png', '3_546.png', '3_567.png', '3_615.png', '3_636.png', '3_647.png', '3_674.png', '3_678.png', '3_714.png', '3_76.png', '3_767.png', '3_801.png', '3_912.png', '3_915.png', '3_999.png'],
  4:['4_1001.png', '4_159.png', '4_183.png', '4_265.png', '4_285.png', '4_294.png', '4_32.png', '4_374.png', '4_390.png', '4_46.png', '4_51.png', '4_514.png', '4_577.png', '4_648.png', '4_67.png', '4_684.png', '4_692.png', '4_736.png', '4_757.png', '4_758.png', '4_808.png', '4_842.png', '4_883.png', '4_960.png']
};


// ****************************************************************************
// *                            Define Trial Lists                            *
// ****************************************************************************

var ENCODE_LIST = {};
var i = 0;  // counter
for(n=0; n<N_ENCODE; n++) {
  for(q=0; q<QUAL_LEVS.length; q++) {
    ENCODE_LIST[i] = ['', QUAL_LEVS[q], GenQual(QUAL_LEVS[q])];
    i++;
  };
};

ENCODE_LIST = _.shuffle(ENCODE_LIST); 

var CHOICE_LIST = {};
var i = 0;  // counter
for(n=0; n<NOBS; n++) {
  for(a=0; a<N_ATTRACT_LEVS; a++) {
    for(q=0; q<QUAL_LEVS.length; q++) {
      CHOICE_LIST[i] = [a, QUAL_LEVS[q], GenQual(QUAL_LEVS[q])];
      i++;
    };
  };
};

CHOICE_LIST = _.shuffle(CHOICE_LIST); 


// ****************************************************************************
// *                               Instructions                               *
// ****************************************************************************

var jbt_intro = {
    type: 'instructions',
    pages: [
      '<p> Welcome! Use the navigation below to go through the instructions</p>', 

     '<p align="left">In this task, you will play the role of selection committee member for an academic honor society. You will see a variety of applicants and their information, and it is up to you to decide who to accept into the honor society and who to reject. It is your job to try and select the most qualified candidates. \
More specifically, each applicant will have four pieces of information that are available to you: <br><br>\
1) Science GPA: GPA (out of 4.0) in science classes (biology, chemistry, etc.) <br><br>\
2) Humanities GPA: GPA (out of 4.0) in humanities classes (English, foreign languages, etc.) <br><br>\
3) Letters of Recommendation: The overall quality (poor, fair, good or excellent) of the letters of recommendation that accompanied the application.  <br><br>\
4) Interview Score: The interview score (out of 100) that the applicant received during the first round of the application process, which just ended. <br><br>\
Importantly, this academic honor society is looking for very well-rounded applicants, so it is crucial that you weigh and consider each of the four qualifications equally when you make your decision about who to accept and who to reject into the next round of the application process. For this round of the application process, you need to reject around half of the applicants, so try to keep an estimate of what percentage of the applicants you have rejected as you complete the task.</p>',
  ],
    show_clickable_nav: true
};

var viewing_instructions = {
    type: 'instructions',
    pages: [   
      `<p align='left'>On the next few screens, you will be seeing some applicant's credentials. This is just to get you familiar with the applicant pool.  For this round, there are ${GetObjSize(ENCODE_LIST)} credentials for you to view.\
 After you briefly see each applicant's credentials, you will then be presented with applicants one at a time. There will be a button on the screen for 'Accept' and another for 'Reject'.</p>`,
  ],
    show_clickable_nav: true
};

var choice_instructions = {
    type: 'instructions',
    pages: [   
      `<p align='left'>On the next screen, you will begin seeing each of the applicants, one at a time. You will also see a headshot of each applicant. \
There will be one option for 'Accept' and another for 'Reject'. Press the 'E' key to REJECT an applicant and press the 'I' key to ACCEPT an applicant. \ 
Again, you should be accepting approximately half of the applicants to reach the next round. \
Finally, you will have to wait at least half of a second before making your decision, and the \
trial will end after ${CHOICE_TIME/1000} seconds, so please try your hardest to make your decision before then.</p>`,
  ],
    show_clickable_nav: true
};

var question_instructions = {
  type: 'instructions', 
  pages: [
      'Now you will be asked to respond to some questions about yourself and your performance on the task. Please respond honestly. Your answers will remain confidential.'
    ], 
  show_clickable_nav: true
};

var debrief = {
    type: 'instructions',
    pages: [
     '<p align="left">Thank you for completing this study! The general purpose of this research is to investigate how people may use social information even when they are asked to make non-social judgments. In this study, you were asked to make a series of accept or reject decisions on a number of applicants and were told to accept half of them. Within the pool of applicants, we varied the qualifications of the applicants to create two groups. Based on their overall qualifications, there was one set of applicants that should have been accepted and another set that should have been rejected.  Furthermore, within each set of applicants that should have been accepted or rejected, there were people with varying levels of physical attractiveness. We are interested in whether these different levels of attractiveness altered the way you decided who should have been accepted and who should have been rejected.  For example, people may be more accurate at deciding who should or should not be accepted when presented with attractive people compared to unattractive people.  Or people may be too lenient or forgiving when deciding on attractive people, and too tough on unattractive people. We also asked you to complete a survey about your attitudes towards attractive and unattractive people. We are interested in how these opinions performance may relate to performance on the honor society task. The results from this study will help us to better understand how people use social information to make evaluations or decisions about others, even when they might not want to use that social information.\
<br><br>Thank you again for your participation in this study.  If you have further please email the lead investigator, Jordan Axt (jordan.axt@mcgill.ca). If you have any ethical concerns or complaints about your participation in this study, and want to speak with someone not on the research team, please contact the McGill Ethics Manager at 514-398-6831 or lynda.mcneil@mcgill.ca.\
<br><br>If you are interested in learning more about this topic, you may find the readings below as a good place to start:\
<br><br>[1] Caruso, E. M., Rahnev, D. A., & Banaji, M. R. (2009). Using conjoint analysis to detect discrimination: Revealing covert preferences from overt choices. Social Cognition, 27(1), 128-137.\
<br><br>[2] Dion, K., Berscheid, E., Walster, E. (1972). What is beautiful is good. Journal of Personality and Social Psychology, 24 (3), 285-290.\</p>',
  ],
    show_clickable_nav: true
};


// ****************************************************************************
// *                                  Trials                                  *
// ****************************************************************************

var phase; 
var fname;
var img_path; 
var attract;
var science_gpa; 
var hum_gpa; 
var int_score;
var rec_letter;
var qual; 
var key_press;
var accept;
var rt;
var timedout; 
var e_trial = 0; 
var c_trial = 0;

var show_profile_lockout = {
  type: 'html-keyboard-response',
  stimulus: function() {

    if(phase=='encoding') {
      attract = ENCODE_LIST[e_trial][0];
      qual    = ENCODE_LIST[e_trial][1];
      [science_gpa, hum_gpa, int_score, rec_letter] = ENCODE_LIST[e_trial][2]

      html = JBTHTML("", ENCODE_LIST[e_trial][2], show_prompt=false);
    } else {
      attract = CHOICE_LIST[c_trial][0];
      qual    = CHOICE_LIST[c_trial][1];
      [science_gpa, hum_gpa, int_score, rec_letter] = CHOICE_LIST[c_trial][2]

      fname    = _.sample(IMG_FILES[CHOICE_LIST[c_trial][0]], 1);
      img_path = `${BASE_IMG_URL}${fname}`;
      html     = JBTHTML(img_path, CHOICE_LIST[c_trial][2], show_prompt=false);
    }

    return(html);
  }, 
  choices: jsPsych.NO_KEYS,
  trial_duration: function() {
    t = phase=='encoding' ? ENCODE_TIME : LOCKOUT_TIME
    return(t)
  },
  post_trial_gap: function() {
    g = phase=='encoding' ? ITI : null
    return(g)
  }, 
};

var show_profile_choice = {
  type: 'html-keyboard-response',
  stimulus: function() {
    html = JBTHTML(img_path, CHOICE_LIST[c_trial][2]);
    return(html);
  }, 
  choices: CHOICE_KEYS,
  trial_duration: CHOICE_TIME,
  post_trial_gap: ITI, 
  on_finish: function(data) {
    if(data.key_press==null) {
      timedout  = true;
      key_press = null;
      rt        = null;
      accept    = null;
  } else {
      key_press = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(data.key_press);
      rt        = data.rt; 
      accept    = key_press==CHOICE_KEYS[0] ? 0:1;
    }

    // remove image from list
    IMG_FILES[CHOICE_LIST[c_trial][0]] = IMG_FILES[CHOICE_LIST[c_trial][0]].filter(function(i) {return i != fname});
  }
};


save_data = {
  type: 'html-keyboard-response',
  stimulus:'', 
  trial_duration: 0, 
  on_finish: function(data) {
    data.is_data_trial = true; 
    data.phase         = phase; 
    data.trial         = phase=='encoding' ? e_trial : c_trial;
    data.img_path      = fname; 
    data.attract       = attract;
    data.science_gpa   = science_gpa; 
    data.hum_gpa       = hum_gpa; 
    data.int_score     = int_score;
    data.rec_letter    = rec_letter;
    data.qual          = qual; 
    data.key_press     = key_press;
    data.accept        = accept;
    data.rt            = rt;
    data.timedout      = timedout;
  }
};

// ****************************************************************************
// *                                   Loops                                  *
// ****************************************************************************


var init_encoding_phase = {
  type:'call-function', 
  func: function() {
    phase = 'encoding';
  }
};

var init_choice_phase = {
  type:'call-function', 
  func: function() {
    phase = 'choice';
  }
};

var encoding_phase = {
  timeline: [show_profile_lockout, save_data], 
  loop_function: function() {
    if(e_trial >= (GetObjSize(ENCODE_LIST)-1)) {
      return false; 
    }
    e_trial ++; 
    timedout = false; 
    return true; 
  }, 
};

var choice_phase = {
  timeline: [show_profile_lockout, show_profile_choice, save_data], 
  loop_function: function() {
    if(c_trial >= (GetObjSize(CHOICE_LIST)-1)) {
      return false; 
    }
    c_trial ++; 
    timedout = false; 
    return true; 
  }, 
};


// ****************************************************************************
// *                                 Questions                                *
// ****************************************************************************


var bias_questions = {
  type: 'survey-multi-choice',
  questions: [
    {
      prompt: "Which statement best describes how you wanted to perform on the task?", 
      name: 'describes_performance', 
      options: [
        'I was extremely easier on physically attractive applicants and extremely tougher on physically unattractive applicants',
        'I was moderately easier on physically attractive applicants and moderately tougher on physically unattractive applicants',
        'I was slightly easier on physically attractive applicants and slightly tougher on physically unattractive applicants',
        'I treated both physically unattractive and physically attractive applicants equally', 
        'I was slightly easier on physically unattractive applicants and slightly tougher on physically attractive applicants',
        'I was moderately easier on physically unattractive applicants and moderately tougher on physically attractive applicants',
        'I was extremely easier on physically unattractive applicants and extremely tougher on physically attractive applicants'], 
      required: true
    }, 
    {
      prompt: "Which statement best describes how you wanted to perform on the task?", 
      name: 'wanted_performance', 
      options: [
        'I wanted to be extremely easier on physically attractive applicants and extremely tougher on physically unattractive applicants',
        'I wanted to be moderately easier on physically attractive applicants and moderately tougher on physically unattractive applicants',
        'I wanted to be slightly easier on physically attractive applicants and slightly tougher on physically unattractive applicants',
        'I wanted to treat both physically unattractive and physically attractive applicants equally',
        'I wanted to be slightly easier on physically unattractive applicants and slightly tougher on physically attractive applicants',
        'I wanted to be moderately easier on physically unattractive applicants and moderately tougher on physically attractive applicants',
        'I wanted to be extremely easier on physically unattractive applicants and extremely tougher on physically attractive applicants'], 
      required: true
      }
    ],
    on_finish: function(data) {
      jsPsych.data.addProperties({
        describes_performance: JSON.parse(data.responses)['describes_performance'],
        wanted_performance:    JSON.parse(data.responses)['wanted_performance']
      });
    } 
  };

var demographics_age = {
  type: 'survey-text',
  questions: [
    {prompt: "Please enter your age", name:'age', required: true},
      ],
  on_finish: function(data) {
    jsPsych.data.addProperties({
      age:    JSON.parse(data.responses)['age'],
    });
  }
};

var demographics_other = {
  type: 'survey-multi-choice',
  questions: [
    {
      prompt: "Please indicate your gender identity", 
      name: 'gender', 
      options: [
       "Female", "Male", "Transgender male", "Transgender female", "Genderqueer", "Another gender identity"
       ], 
      required: true
    }, 
    {
      prompt: "What is your racial identity?", 
      name: 'racial_identity', 
      options: ["African-Canadian", 
        "Black, African", "Caribbean",
         "Asian", "Asian", "Pacific Islander", 
         "European", "Anglo", "Caucasian", 
         "Hispanic", "Latino(a)", "Chicano(a)",
          "Indigenous", "Bi-racial, Multi-racial", "Other (please specify)"
          ], 
      required: true
      },
      {
      prompt: "Were you born in Canada?", 
      name: 'born_in_can', 
      options: ["Yes","No"], 
      required: true
      },
      {
      prompt: "Is English your first language?", 
      name: 'language', 
      options: ["Yes","No"], 
      required: true
      }
    ],
    on_finish: function(data) {
      jsPsych.data.addProperties({
        gender:         JSON.parse(data.responses)['gender'],
        race:           JSON.parse(data.responses)['racial_identity'],
        born_in_can:    JSON.parse(data.responses)['born_in_can'],
        eng_first_lang: JSON.parse(data.responses)['language'],

      });
    } 
  };

// ****************************************************************************
// *                                    Run                                   *
// ****************************************************************************

var fs = {
  type: 'fullscreen', 
  fullscreen_mode: true,
  on_start: function(){
    // set up task appearence
    document.body.style.background = "white";
    document.body.style.color = 'black'   
  }
};


end_screen = {
  type: 'html-keyboard-response',
  stimulus: 'Thank you for your participation! You are done the study. Your completion code is XXXXXXX. Copy this code <b>now</b>.\nThen, press SPACE and this page should redirect to Prolific shortly. If it does not, paste the code you copied into your Prolific app.',
  choices: ['space'],
};


// Setup Timeline
if(DEBUGMODE) {
  timeline = [jbt_intro, viewing_instructions, init_choice_phase, choice_phase];
} else {
  timeline = [fs, jbt_intro, viewing_instructions, init_encoding_phase, encoding_phase, choice_instructions, init_choice_phase, choice_phase, question_instructions, bias_questions, demographics_age, demographics_other, debrief, end_screen];
}


img_preload = []; 
img_preload.push(IMG_FILES[0]);
img_preload.push(IMG_FILES[1]);
img_preload.push(IMG_FILES[2]);
img_preload.push(IMG_FILES[3]);
img_preload.push(IMG_FILES[4]);
img_preload.push(['Accept.jpg','Reject.jpg']);

img_preload = img_preload.flat().map(function(i) {return BASE_IMG_URL + i});


// Run and preload images
jsPsych.init({
    show_preload_progress_bar: true,
    preload_images: img_preload,  
    timeline: timeline,
    on_finish: function() {
      if(DEBUGMODE) {
        jsPsych.data.get().localSave('csv', '_debug.csv');
        return null;
      }

    // window.open('https://app.prolific.co/submissions/complete?cc=C1CI1SVL', '_blank');
    }
});
