import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Language = "EN" | "MM";

const LANGUAGE_KEY = "founders:language";
const LANGUAGE_EVENT = "founders:language-change";
const burmese: Record<string, string> = {
  Home: "ပင်မ",
  Directory: "တည်ထောင်သူများ",
  About: "ကျွန်ုပ်တို့အကြောင်း",
  Contact: "ဆက်သွယ်ရန်",
  Login: "ဝင်ရောက်ရန်",
  "Close menu": "မီနူးပိတ်ရန်",
  "Open menu": "မီနူးဖွင့်ရန်",
"Your trusted source for verified business founders and authentic entrepreneurial profiles.":
  "စိစစ်အတည်ပြုထားသော စီးပွားရေးလုပ်ငန်းတည်ထောင်သူများနှင့် ၎င်းတို့၏ ယုံကြည်စိတ်ချရသော ကိုယ်ရေးအချက်အလက်များကို ရှာဖွေနိုင်သည့် ပလက်ဖောင်း။",  "Quick links": "အမြန်လင့်ခ်များ",
  "About us": "ကျွန်ုပ်တို့အကြောင်း",
  Resources: "အထောက်အကူပြုအရင်းအမြစ်များ",
  "Verification process": "စိစစ်အတည်ပြုမှု လုပ်ငန်းစဉ်",
  "Submit a founder": "တည်ထောင်သူတစ်ဦး တင်သွင်းရန်",
  "Contact us": "ဆက်သွယ်ရန်",
  "© 2025 Founders. All rights reserved.":
    "© ၂၀၂၅ Founders။ မူပိုင်ခွင့်အားလုံး ရယူထားသည်။",
  "Verified founders. Stronger connections.":
    "အတည်ပြုထားသော တည်ထောင်သူများ။ ပိုမိုခိုင်မာသော ချိတ်ဆက်မှုများ။",
  "Trusted by Myanmar’s founder community":
    "မြန်မာနိုင်ငံရှိ စီးပွားရေးလုပ်ငန်းတည်ထောင်သူများ၏ ယုံကြည်မှုကို ရရှိထားသည်",
  "Your source for": "ယုံကြည်စိတ်ချရသော",
  "Built for Myanmar’s founder community": "မြန်မာနိုင်ငံရှိ တည်ထောင်သူအသိုင်းအဝိုင်းအတွက်",
  "Discover Myanmar’s founders.": "မြန်မာနိုင်ငံရှိ တည်ထောင်သူများကို ရှာဖွေပါ။",
  "Connect. Build. Grow.": "ချိတ်ဆက်ပါ။ တည်ဆောက်ပါ။ တိုးတက်ပါ။",
  "Find trusted founder profiles, discover local businesses, and learn alongside people building across Myanmar.":
    "ယုံကြည်စိတ်ချရသော တည်ထောင်သူကိုယ်ရေးအကျဉ်းများနှင့် ဒေသတွင်းလုပ်ငန်းများကို ရှာဖွေပြီး မြန်မာတစ်ဝန်း လုပ်ငန်းတည်ဆောက်နေသူများနှင့်အတူ လေ့လာပါ။",
  "Search founders, businesses, or industries": "တည်ထောင်သူများ၊ လုပ်ငန်းများ သို့မဟုတ် ကဏ္ဍများကို ရှာဖွေပါ",
  Discover: "ရှာဖွေရန်",
  "Founder-led profiles": "တည်ထောင်သူများကိုယ်တိုင် ဖန်တီးထားသော ကိုယ်ရေးအကျဉ်းများ",
  "Local peer communities": "ဒေသတွင်း မိတ်ဖက်အသိုင်းအဝိုင်းများ",
  "Featured founder": "အထူးဖော်ပြထားသော တည်ထောင်သူ",
  "Thiri Aung": "သီရိအောင်",
  "Founder · Thazin Labs": "တည်ထောင်သူ · သဇင် လက်ဘ်စ်",
  "Our approach": "ကျွန်ုပ်တို့၏ ချဉ်းကပ်ပုံ",
  "People, not profiles alone": "ကိုယ်ရေးအကျဉ်းများသာမက လူများ",
  "Learn how founders work and what they are building.": "တည်ထောင်သူများ၏ လုပ်ငန်းနှင့် တည်ဆောက်နေသည့်အရာများကို လေ့လာပါ။",
  "Local context": "ဒေသတွင်းအကြောင်းအရာ",
  "Explore businesses shaped by real communities.": "ဒေသခံအသိုင်းအဝိုင်းများ၏ လိုအပ်ချက်နှင့် ကိုက်ညီသော လုပ်ငန်းများကို ရှာဖွေပါ။",
  "Trust with purpose": "ရည်ရွယ်ချက်ရှိသော ယုံကြည်မှု",
  "Clear verification without exposing private documents.": "ကိုယ်ရေးကိုယ်တာစာရွက်စာတမ်းများကို မဖော်ပြဘဲ ရှင်းလင်းစွာ စိစစ်အတည်ပြုပါ။",
  "Meet the people": "လုပ်ငန်းတည်ဆောက်နေသူများနှင့် တွေ့ဆုံပါ",
  "Founders to know": "သိထားသင့်သော တည်ထောင်သူများ",
  "Meet people building thoughtful businesses across Myanmar.": "မြန်မာတစ်ဝန်း အကျိုးရှိသော လုပ်ငန်းများ တည်ဆောက်နေသူများနှင့် တွေ့ဆုံပါ။",
  "View directory": "စာရင်းကို ကြည့်ရန်",
  "Made in Myanmar": "မြန်မာနိုင်ငံတွင် ထုတ်လုပ်သည်",
  "Built by local teams": "ဒေသခံအဖွဲ့များက တည်ဆောက်ထားသည်",
  "Explore products and services shaped by local teams and local needs.": "ဒေသခံအဖွဲ့များနှင့် ဒေသလိုအပ်ချက်များအပေါ် အခြေခံထားသော ထုတ်ကုန်နှင့် ဝန်ဆောင်မှုများကို ရှာဖွေပါ။",
  "Explore businesses": "လုပ်ငန်းများကို ရှာဖွေရန်",
  "Find your peers": "မိတ်ဖက်များကို ရှာဖွေပါ",
  "Communities for the work behind the work": "လုပ်ငန်းနောက်ကွယ်မှ ပူးပေါင်းဆောင်ရွက်မှုများအတွက် အသိုင်းအဝိုင်းများ",
  "Share useful lessons, ask specific questions, and build relationships with founders who understand the market around you.":
    "အသုံးဝင်သော သင်ခန်းစာများ မျှဝေပါ၊ တိကျသော မေးခွန်းများ မေးမြန်းပါ၊ သင့်ပတ်ဝန်းကျင်ဈေးကွက်ကို နားလည်သော တည်ထောင်သူများနှင့် ဆက်ဆံရေး တည်ဆောက်ပါ။",
  "Local network": "ဒေသတွင်းကွန်ရက်",
  "City community": "မြို့တွင်းအသိုင်းအဝိုင်း",
  "Industry network": "လုပ်ငန်းကဏ္ဍကွန်ရက်",
  "A practical peer network for founders building and operating in Yangon.": "ရန်ကုန်တွင် လုပ်ငန်းတည်ဆောက်ပြီး လည်ပတ်နေသော တည်ထောင်သူများအတွက် လက်တွေ့အသုံးဝင်သည့် မိတ်ဖက်ကွန်ရက်။",
  "Conversations, local lessons, and founder connections across Mandalay.": "မန္တလေးတစ်ဝန်း ဆွေးနွေးမှုများ၊ ဒေသတွင်းအတွေ့အကြုံများနှင့် တည်ထောင်သူချိတ်ဆက်မှုများ။",
  "A focused group discussing technology, teams, and access.": "နည်းပညာ၊ အဖွဲ့များနှင့် အခွင့်အလမ်းများအကြောင်း အာရုံစိုက်ဆွေးနွေးသည့် အဖွဲ့။",
  "Verification that respects privacy": "ကိုယ်ရေးကိုယ်တာကို လေးစားသော စိစစ်အတည်ပြုမှု",
  "A clearer signal of founder and business credibility.": "တည်ထောင်သူနှင့် လုပ်ငန်း၏ ယုံကြည်စိတ်ချရမှုကို ပိုမိုရှင်းလင်းစွာ ဖော်ပြခြင်း။",
  "Verification helps the community know who stands behind a business. Proof documents stay private and are never shown on public profiles.":
    "စိစစ်အတည်ပြုမှုက လုပ်ငန်းနောက်ကွယ်တွင် မည်သူရှိကြောင်း အသိုင်းအဝိုင်းက သိရှိစေသည်။ အထောက်အထားစာရွက်စာတမ်းများကို သီးသန့်ထားရှိပြီး အများမြင်ကိုယ်ရေးအကျဉ်းများတွင် မဖော်ပြပါ။",
  "Learn about verification": "စိစစ်အတည်ပြုမှုအကြောင်း လေ့လာရန်",
  "Complete your business profile": "လုပ်ငန်းကိုယ်ရေးအကျဉ်းကို ဖြည့်စွက်ပါ",
  "Give the community enough context to understand what you are building.": "သင်တည်ဆောက်နေသည့်အရာကို အသိုင်းအဝိုင်းက နားလည်နိုင်ရန် အချက်အလက်များ ဖြည့်ပါ။",
  "Submit proof privately": "အထောက်အထားကို သီးသန့်တင်သွင်းပါ",
  "Share supporting information for review by the Founders team.": "Founders အဖွဲ့မှ စိစစ်ရန် အထောက်အကူပြုအချက်အလက်များ ပေးပို့ပါ။",
  "Build with a trusted identity": "ယုံကြည်စိတ်ချရသော အထောက်အထားဖြင့် တည်ဆောက်ပါ",
  "Your profile receives a clear verification badge when approved.": "အတည်ပြုပြီးပါက သင့်ကိုယ်ရေးအကျဉ်းတွင် ရှင်းလင်းသော အတည်ပြုတံဆိပ်ကို ပြသမည်။",
  "Build your founder presence. Find your people.": "တည်ထောင်သူအဖြစ် မိတ်ဆက်ပါ။ သင့်မိတ်ဖက်များကို ရှာဖွေပါ။",
  "Create a profile, introduce your business, and join conversations that move work forward.":
    "ကိုယ်ရေးအကျဉ်းဖန်တီးပါ၊ သင့်လုပ်ငန်းကို မိတ်ဆက်ပါ၊ လုပ်ငန်းတိုးတက်စေမည့် ဆွေးနွေးမှုများတွင် ပါဝင်ပါ။",
  "Create your founder profile": "တည်ထောင်သူကိုယ်ရေးအကျဉ်း ဖန်တီးရန်",
  "Preview dashboard": "ဒက်ရှ်ဘုတ်ကို အကြိုကြည့်ရန်",
  verified: "အတည်ပြုထားသည့်",
  "business founders": "စီးပွားရေးလုပ်ငန်း တည်ထောင်သူများ",
  "Discover authentic entrepreneurial profiles backed by rigorous verification. Connect with credible business leaders you can trust.":
    "စိစစ်အတည်ပြုထားသော လုပ်ငန်းတည်ထောင်သူများ၏ ကိုယ်ရေးအချက်အလက်များကို လေ့လာရှာဖွေပြီး ယုံကြည်စိတ်ချရသော စီးပွားရေးလုပ်ငန်းရှင်များနှင့် ချိတ်ဆက်လိုက်ပါ။",
  "Browse directory": "တည်ထောင်သူများကို ရှာဖွေရန်",
  "How verification works": "အတည်ပြုပုံကို ကြည့်ရန်",
  "67+ verified founders": "အတည်ပြုထားသော တည်ထောင်သူ ၆၇ ဦးကျော်",
  "Growing every week across Myanmar":
    "မြန်မာတစ်ဝန်း အပတ်စဉ် တိုးပွားလျက်ရှိသည်",
  "Verified founder network": "အတည်ပြုထားသော တည်ထောင်သူကွန်ရက်",
  "Authentic profiles. Trusted connections.":
    "စစ်မှန်သော ကိုယ်ရေးအကျဉ်းများ။ ယုံကြည်စိတ်ချရသော ချိတ်ဆက်မှုများ။",
  Founders: "တည်ထောင်သူများ",
  "4-step": "အဆင့် ၄ ဆင့်",
  "Manually reviewed": "လူကိုယ်တိုင် စိစစ်ထားသည်",
  "For credibility": "ယုံကြည်စိတ်ချရမှုအတွက်",
  "Real businesses": "စစ်မှန်သော လုပ်ငန်းများ",
  "Registry checked": "မှတ်ပုံတင်စာရင်း စစ်ဆေးထားသည်",
  "Built on trust": "ယုံကြည်မှုကို အခြေခံထားသည်",
  "Why verification matters": "ဘာကြောင့် စိစစ်အတည်ပြုမှုက အရေးကြီးတာလဲ",
  "Our comprehensive process ensures authenticity and builds trust in Myanmar’s entrepreneurial ecosystem.":
    "ကျွန်ုပ်တို့၏ ပြည့်စုံသော လုပ်ငန်းစဉ်သည် စစ်မှန်မှုကို အာမခံပြီး မြန်မာနိုင်ငံ၏ စွန့်ဦးတီထွင်မှု အသိုင်းအဝိုင်းတွင် ယုံကြည်မှုကို တည်ဆောက်ပေးသည်။",
  "Founder verification": "တည်ထောင်သူ စိစစ်အတည်ပြုခြင်း",
  "Create your profile": "ကိုယ်ရေးအကျဉ်း ဖန်တီးရန်",
  "Back to Founders": "Founders သို့ ပြန်ရန်",
  "Start with who you are. Build from there.": "သင်ဘယ်သူလဲဆိုတာမှ စတင်ပြီး အဆင့်ဆင့် တည်ဆောက်ပါ။",
  "Your draft stays in this browser while you move through the four short steps.":
    "အဆင့်လေးဆင့်ကို ဖြတ်သန်းနေစဉ် သင့်မူကြမ်းကို ဤဘရောက်ဇာတွင် သိမ်းဆည်းထားမည်။",
  "Step 1 of 4 · Account": "အဆင့် ၄ ဆင့်အနက် ၁ · အကောင့်",
  "Step 2 of 4 · Founder profile": "အဆင့် ၄ ဆင့်အနက် ၂ · တည်ထောင်သူကိုယ်ရေးအကျဉ်း",
  "Step 3 of 4 · Business": "အဆင့် ၄ ဆင့်အနက် ၃ · လုပ်ငန်း",
  "Step 4 of 4 · Verification": "အဆင့် ၄ ဆင့်အနက် ၄ · စိစစ်အတည်ပြုခြင်း",
  "Tell founders who you are": "သင်ဘယ်သူလဲဆိုတာ တည်ထောင်သူများကို ပြောပြပါ",
  "Introduce your business": "သင့်လုပ်ငန်းကို မိတ်ဆက်ပါ",
  "Build trust through verification": "စိစစ်အတည်ပြုမှုမှတစ်ဆင့် ယုံကြည်မှု တည်ဆောက်ပါ",
  "Set up your sign-in details to get started.": "စတင်ရန် အကောင့်ဝင်အချက်အလက်များကို ဖြည့်ပါ။",
  "Keep it specific and human. This information will appear on your public profile.":
    "တိကျပြီး သဘာဝကျစွာ ရေးသားပါ။ ဤအချက်အလက်များကို အများမြင်ကိုယ်ရေးအကျဉ်းတွင် ပြသမည်။",
  "Add enough context for people to understand what you are building.":
    "သင်တည်ဆောက်နေသည့်အရာကို လူများနားလည်နိုင်ရန် လုံလောက်သော အချက်အလက်များ ထည့်ပါ။",
  "Business proof is reviewed privately. It never appears in the directory or on your public profile.":
    "လုပ်ငန်းအထောက်အထားကို သီးသန့်စိစစ်သည်။ ၎င်းကို လုပ်ငန်းစာရင်း သို့မဟုတ် အများမြင်ကိုယ်ရေးအကျဉ်းတွင် မပြသပါ။",
  "Save & continue": "သိမ်းဆည်းပြီး ဆက်ရန်",
  "Choose photo": "ဓာတ်ပုံရွေးရန်",
  "Role": "ရာထူး",
  "Business description": "လုပ်ငန်းအကြောင်း",
  "Founded year": "တည်ထောင်သည့်နှစ်",
  "Choose a business proof document": "လုပ်ငန်းအထောက်အထား စာရွက်စာတမ်းရွေးပါ",
  "PDF, PNG, or JPG · filename stays in this browser": "PDF, PNG သို့မဟုတ် JPG · ဖိုင်အမည်ကို ဤဘရောက်ဇာတွင်သာ သိမ်းမည်",
  "No file is actually uploaded in this prototype. Only the filename is shown locally.":
    "ဤစမ်းသပ်ဗားရှင်းတွင် ဖိုင်ကို အမှန်တကယ် တင်မည်မဟုတ်ပါ။ စက်တွင်းဖိုင်အမည်ကိုသာ ပြသမည်။",
  "Create founder profile": "တည်ထောင်သူကိုယ်ရေးအကျဉ်း ဖန်တီးရန်",
  "Passwords do not match.": "စကားဝှက်များ မတူညီပါ။",
  "Build trust without putting private documents on display.": "ကိုယ်ရေးကိုယ်တာ စာရွက်စာတမ်းများကို အများမြင်မပြဘဲ ယုံကြည်မှု တည်ဆောက်ပါ။",
  "Verification confirms that a founder is connected to the business shown on their profile. Supporting documents are reviewed privately and never published.":
    "စိစစ်အတည်ပြုခြင်းသည် တည်ထောင်သူနှင့် ကိုယ်ရေးအကျဉ်းတွင် ဖော်ပြထားသော လုပ်ငန်းတို့၏ ဆက်စပ်မှုကို အတည်ပြုပေးသည်။ အထောက်အထားစာရွက်စာတမ်းများကို သီးသန့်စိစစ်ပြီး အများမြင်ထုတ်ပြန်ခြင်း မပြုပါ။",
  "Start your profile": "ကိုယ်ရေးအကျဉ်း စတင်ဖန်တီးရန်",
  "Questions? Contact us": "မေးခွန်းရှိပါသလား။ ဆက်သွယ်ရန်",
  "How it works": "လုပ်ဆောင်ပုံ",
  "Clear steps, visible progress": "ရှင်းလင်းသော အဆင့်များ၊ မြင်သာသော တိုးတက်မှု",
  "Know what to expect as your founder and business details are reviewed.":
    "တည်ထောင်သူနှင့် လုပ်ငန်းအချက်အလက်များကို စိစစ်နေစဉ် မျှော်မှန်းနိုင်သည်များကို သိရှိထားပါ။",
  "Complete your profile": "ကိုယ်ရေးအကျဉ်း ဖြည့်စွက်ပါ",
  "Add your founder and business information so we understand the context.":
    "အခြေအနေကို နားလည်နိုင်ရန် တည်ထောင်သူနှင့် လုပ်ငန်းအချက်အလက်များကို ဖြည့်ပါ။",
  "Submit business proof": "လုပ်ငန်းအထောက်အထား တင်သွင်းပါ",
  "Provide supporting business documents through the private verification flow.":
    "သီးသန့်စိစစ်အတည်ပြုမှု လုပ်ငန်းစဉ်မှတစ်ဆင့် လုပ်ငန်းအထောက်အထားစာရွက်စာတမ်းများ ပေးပို့ပါ။",
  Review: "စိစစ်ခြင်း",
  "Our review team checks the information and may ask for a clearer document.":
    "ကျွန်ုပ်တို့၏ စိစစ်ရေးအဖွဲ့က အချက်အလက်များကို စစ်ဆေးပြီး ပိုမိုရှင်းလင်းသော စာရွက်စာတမ်းကို တောင်းဆိုနိုင်သည်။",
  "A clear badge appears on your eligible founder and business profiles.":
    "သတ်မှတ်ချက်နှင့် ကိုက်ညီသော တည်ထောင်သူနှင့် လုပ်ငန်းကိုယ်ရေးအကျဉ်းများတွင် အတည်ပြုတံဆိပ်ကို ပြသမည်။",
  "Your documents stay private": "သင့်စာရွက်စာတမ်းများကို သီးသန့်ထားရှိသည်",
  "Proof documents are not part of the public directory, founder profile, or business profile. In this prototype, no file is uploaded; only a local filename is displayed.":
    "အထောက်အထားစာရွက်စာတမ်းများကို အများမြင်စာရင်း၊ တည်ထောင်သူကိုယ်ရေးအကျဉ်း သို့မဟုတ် လုပ်ငန်းကိုယ်ရေးအကျဉ်းတွင် မထည့်သွင်းပါ။ ဤစမ်းသပ်ဗားရှင်းတွင် ဖိုင်တင်ခြင်းမရှိဘဲ စက်တွင်းဖိုင်အမည်ကိုသာ ပြသသည်။",
  "Join the community": "Community သို့ ဝင်ရောက်ပါ",
  "Build credibility with a verified profile":
    "အတည်ပြုထားသော ကိုယ်ရေးအကျဉ်းဖြင့် ယုံကြည်စိတ်ချရမှု တည်ဆောက်ပါ",
  "Are you a business founder looking to establish credibility? Submit your profile for verification and join our trusted network.":
    "ယုံကြည်စိတ်ချရမှု တည်ဆောက်လိုသော စီးပွားရေးတည်ထောင်သူ ဖြစ်ပါသလား။ သင့်ကိုယ်ရေးအကျဉ်းကို အတည်ပြုရန် တင်သွင်းပြီး ကျွန်ုပ်တို့၏ ယုံကြည်စိတ်ချရသော ကွန်ရက်သို့ ဝင်ရောက်ပါ။",
  "Browse all founders": "တည်ထောင်သူအားလုံးကို ကြည့်ရန်",
  "Founder directory": "တည်ထောင်သူစာရင်း",
  "Founder ecosystem": "တည်ထောင်သူများ၏ လုပ်ငန်းအသိုင်းအဝိုင်း",
  "Discover who’s building in Myanmar": "မြန်မာနိုင်ငံတွင် လုပ်ငန်းတည်ဆောက်နေသူများကို ရှာဖွေပါ",
  "Search people and businesses by what they build, where they work, and the communities they serve.":
    "သူတို့လုပ်ကိုင်သည့် လုပ်ငန်း၊ တည်နေရာနှင့် ဝန်ဆောင်မှုပေးသည့် အသိုင်းအဝိုင်းတို့အလိုက် လူများနှင့် လုပ်ငန်းများကို ရှာဖွေပါ။",
  "Directory type": "စာရင်းအမျိုးအစား",
  Businesses: "လုပ်ငန်းများ",
  "Search founders...": "တည်ထောင်သူများကို ရှာဖွေပါ...",
  "Search businesses...": "လုပ်ငန်းများကို ရှာဖွေပါ...",
  "Search founders": "တည်ထောင်သူများကို ရှာဖွေရန်",
  "Search businesses": "လုပ်ငန်းများကို ရှာဖွေရန်",
  "Filter directory": "စာရင်းကို စစ်ထုတ်ရန်",
  Clear: "ရှင်းလင်းရန်",
  "All locations": "တည်နေရာအားလုံး",
  "Filter options": "စစ်ထုတ်မှုရွေးချယ်စရာများ",
  "Select industry": "လုပ်ငန်းကဏ္ဍကို ရွေးချယ်ပါ",
  "Select location": "တည်နေရာကို ရွေးချယ်ပါ",
  "Select founded year": "တည်ထောင်သည့်နှစ်ကို ရွေးချယ်ပါ",
  "Any year": "မည်သည့်နှစ်မဆို",
  "Verified only": "အတည်ပြုပြီးသူများသာ",
  "Show profiles reviewed by Founders": "Founders မှ စိစစ်ထားသော ကိုယ်ရေးအကျဉ်းများကို ပြရန်",
  "Clear filters": "စစ်ထုတ်မှုများကို ရှင်းလင်းရန်",
  results: "ရလဒ်များ",
  "Fictional profiles for prototype use": "စမ်းသပ်အသုံးပြုရန် ဖန်တီးထားသော နမူနာကိုယ်ရေးအကျဉ်းများ",
  "View business": "လုပ်ငန်းကို ကြည့်ရန်",
  "No results found": "ရလဒ်မတွေ့ပါ",
  "Try changing your search or clearing one or more filters.":
    "ရှာဖွေမှုကို ပြောင်းလဲကြည့်ပါ သို့မဟုတ် စစ်ထုတ်မှုအချို့ကို ရှင်းလင်းပါ။",
  Page: "စာမျက်နှာ",
  of: "မှ",
  Previous: "ယခင်",
  Next: "နောက်တစ်ခု",
  Education: "ပညာရေး",
  Logistics: "ထောက်ပံ့ပို့ဆောင်ရေး",
  "Arts & Crafts": "အနုပညာနှင့် လက်မှုပညာ",
  "Food & Beverage": "စားသောက်ကုန်နှင့် အဖျော်ယမကာ",
  Manufacturing: "ကုန်ထုတ်လုပ်မှု",
  Taunggyi: "တောင်ကြီး",
  "Founder & CEO": "တည်ထောင်သူနှင့် အမှုဆောင်အရာရှိချုပ်",
  "Building practical software for growing teams across Myanmar.":
    "မြန်မာနိုင်ငံတစ်ဝန်း တိုးတက်နေသော အဖွဲ့များအတွက် လက်တွေ့အသုံးဝင်သည့် ဆော့ဖ်ဝဲများ တည်ဆောက်ပေးနေသည်။",
  "Helping independent Myanmar brands reach customers beyond their home city.":
    "မြန်မာနိုင်ငံရှိ ကိုယ်ပိုင်အမှတ်တံဆိပ်များအား မိမိတို့မြို့ပြင်ပရှိ ဖောက်သည်များထံ ရောက်ရှိစေရန် ကူညီပေးနေသည်။",
  "Making high-quality jewelry more accessible to local customers.":
    "အရည်အသွေးမြင့် လက်ဝတ်ရတနာများကို ဒေသခံဖောက်သည်များ ပိုမိုလွယ်ကူစွာ ဝယ်ယူနိုင်စေရန် ဆောင်ရွက်နေသည်။",
  "Connecting customers with dependable devices and helpful service.":
    "ယုံကြည်စိတ်ချရသော စက်ပစ္စည်းများနှင့် အထောက်အကူပြုဝန်ဆောင်မှုများဖြင့် ဖောက်သည်များကို ချိတ်ဆက်ပေးနေသည်။",
  "Building useful digital tools for businesses and their customers.":
    "လုပ်ငန်းများနှင့် ၎င်းတို့၏ ဖောက်သည်များအတွက် အသုံးဝင်သော ဒစ်ဂျစ်တယ်ကိရိယာများ တည်ဆောက်နေသည်။",
  "Making job-ready learning more accessible to young people outside major cities.":
    "မြို့ကြီးများပြင်ပရှိ လူငယ်များအတွက် အလုပ်အကိုင်အဆင်သင့်ဖြစ်စေမည့် သင်ယူမှုများကို ပိုမိုလွယ်ကူစွာ ရရှိစေရန် ဆောင်ရွက်နေသည်။",
  "Building dependable regional delivery networks for small businesses.":
    "အသေးစားလုပ်ငန်းများအတွက် ယုံကြည်စိတ်ချရသော ဒေသတွင်း ပို့ဆောင်ရေးကွန်ရက်များ တည်ဆောက်နေသည်။",
  "Connecting Myanmar makers with customers who value thoughtful craft.":
    "မြန်မာလက်မှုပညာရှင်များနှင့် လက်ရာမြောက်မှုကို တန်ဖိုးထားသော ဖောက်သည်များကို ချိတ်ဆက်ပေးနေသည်။",
  "Growing nutritious local food products with sustainable sourcing.":
    "ရေရှည်တည်တံ့သော ကုန်ကြမ်းရင်းမြစ်များကို အသုံးပြု၍ အာဟာရပြည့်ဝသော ဒေသထွက်အစားအစာများ ထုတ်လုပ်တိုးချဲ့နေသည်။",
  "Supporting small-batch makers with shared production and market access.":
    "အသေးစားထုတ်လုပ်သူများအား မျှဝေထုတ်လုပ်မှုနှင့် ဈေးကွက်ဝင်ရောက်နိုင်မှုတို့ဖြင့် ပံ့ပိုးပေးနေသည်။",
  "Verified": "အတည်ပြုပြီး",
  "View profile": "ကိုယ်ရေးအကျဉ်း ကြည့်ရန်",
  "Back to directory": "တည်ထောင်သူစာရင်းသို့ ပြန်ရန်",
  "Verified founder": "အတည်ပြုထားသော တည်ထောင်သူ",
  "Business details": "လုပ်ငန်းအသေးစိတ်",
  "About the business": "လုပ်ငန်းအကြောင်း",
  "Founder not found": "တည်ထောင်သူကို မတွေ့ပါ",
  "This founder profile is unavailable.": "ဤတည်ထောင်သူ ကိုယ်ရေးအကျဉ်းကို မရရှိနိုင်ပါ။",
  "Find a verified founder": "အတည်ပြုထားသော တည်ထောင်သူကို ရှာရန်",
  "Explore trusted founders by name, company, or industry.":
    "ယုံကြည်စိတ်ချရသော တည်ထောင်သူများကို အမည်၊ ကုမ္ပဏီ သို့မဟုတ် လုပ်ငန်းကဏ္ဍအလိုက် ရှာဖွေပါ။",
  "Search founders, companies, industries...":
    "တည်ထောင်သူများ၊ ကုမ္ပဏီများ၊ လုပ်ငန်းကဏ္ဍများကို ရှာရန်...",
  "Filter by industry": "လုပ်ငန်းကဏ္ဍအလိုက် စစ်ထုတ်ရန်",
  "All industries": "လုပ်ငန်းကဏ္ဍအားလုံး",
  Retail: "လက်လီရောင်းဝယ်ရေး",
  "Beauty & Personal Care": "အလှအပနှင့် ကိုယ်ရေးကိုယ်တာ စောင့်ရှောက်မှု",
  "Our mission": "ကျွန်ုပ်တို့၏ ရည်မှန်းချက်",
  "Trust is the foundation of every great business connection.":
    "ယုံကြည်မှုသည် ကောင်းမွန်သော စီးပွားရေးဆက်ဆံမှုတိုင်း၏ အခြေခံဖြစ်သည်။",
  "At VerifiedFounders, we’re committed to building trust in the entrepreneurial ecosystem by providing a reliable platform where business founders can establish credibility through rigorous verification.":
    "VerifiedFounders တွင် စီးပွားရေးတည်ထောင်သူများက တင်းကျပ်သော စိစစ်အတည်ပြုမှုမှတစ်ဆင့် ယုံကြည်စိတ်ချရမှု တည်ဆောက်နိုင်သည့် ယုံကြည်ရသော ပလက်ဖောင်းတစ်ခု ပံ့ပိုးပေးခြင်းဖြင့် စွန့်ဦးတီထွင်မှု အသိုင်းအဝိုင်းတွင် ယုံကြည်မှု တည်ဆောက်ရန် ကျွန်ုပ်တို့ ကတိပြုထားသည်။",
  "Our verification framework": "ကျွန်ုပ်တို့၏ စိစစ်အတည်ပြုမှု လုပ်ငန်းစဉ်",
  "Every founder profile undergoes a comprehensive four-step verification process.":
    "တည်ထောင်သူ ကိုယ်ရေးအကျဉ်းတိုင်းသည် ပြည့်စုံသော အဆင့်လေးဆင့် အတည်ပြုမှုလုပ်ငန်းစဉ်ကို ဖြတ်သန်းရသည်။",
  "Identity review": "အထောက်အထား စိစစ်ခြင်း",
  "We verify the founder’s identity through secure and reliable documents.":
    "လုံခြုံပြီး ယုံကြည်စိတ်ချရသော စာရွက်စာတမ်းများမှတစ်ဆင့် တည်ထောင်သူ၏ အထောက်အထားကို စိစစ်အတည်ပြုသည်။",
  "Business validation": "လုပ်ငန်း စိစစ်အတည်ပြုခြင်း",
  "We confirm that the represented business is registered and active.":
    "ဖော်ပြထားသော လုပ်ငန်းသည် မှတ်ပုံတင်ထားပြီး လည်ပတ်နေကြောင်း အတည်ပြုသည်။",
  "Registry check": "မှတ်ပုံတင်စာရင်း စစ်ဆေးခြင်း",
  "Relevant public and official records are reviewed for consistency.":
    "သက်ဆိုင်ရာ အများပြည်သူဆိုင်ရာနှင့် တရားဝင်မှတ်တမ်းများ၏ ကိုက်ညီမှုကို စိစစ်သည်။",
  "Final approval": "နောက်ဆုံးအတည်ပြုချက်",
  "Our team conducts a final review before publishing a verified profile.":
    "အတည်ပြုထားသော ကိုယ်ရေးအကျဉ်းကို ထုတ်ပြန်ခြင်းမပြုမီ ကျွန်ုပ်တို့အဖွဲ့က နောက်ဆုံးအကြိမ် စိစစ်သည်။",
  "Growing together": "အတူတကွ တိုးတက်ခြင်း",
  "Trusted by leading organizations":
    "ထိပ်တန်းအဖွဲ့အစည်းများ၏ ယုံကြည်မှုကို ရရှိထားသည်",
  "Partner logo 1": "မိတ်ဖက် Logo ၁",
  "Partner logo 2": "မိတ်ဖက် Logo ၂",
  "Partner logo 3": "မိတ်ဖက် Logo ၃",
  "Partner logo 4": "မိတ်ဖက် Logo ၄",
  "Trust, verified": "ယုံကြည်မှုကို အတည်ပြုထားသည်",
  "Our verification process": "ကျွန်ုပ်တို့၏ အတည်ပြုမှုလုပ်ငန်းစဉ်",
  "Trust is earned through transparency. Our four-step process helps ensure every founder profile is authentic and credible.":
    "ပွင့်လင်းမြင်သာမှုမှတစ်ဆင့် ယုံကြည်မှုကို ရရှိသည်။ ကျွန်ုပ်တို့၏ အဆင့်လေးဆင့် လုပ်ငန်းစဉ်သည် တည်ထောင်သူ ကိုယ်ရေးအကျဉ်းတိုင်း စစ်မှန်ပြီး ယုံကြည်စိတ်ချရကြောင်း အာမခံပေးသည်။",
  "We verify the founder’s identity through official documents and secure checks.":
    "တရားဝင်စာရွက်စာတမ်းများနှင့် လုံခြုံသော စစ်ဆေးမှုများမှတစ်ဆင့် တည်ထောင်သူ၏ အထောက်အထားကို အတည်ပြုသည်။",
  "We confirm business registration and active operations through registry evidence.":
    "မှတ်ပုံတင်စာရင်း အထောက်အထားများမှတစ်ဆင့် လုပ်ငန်းမှတ်ပုံတင်ထားမှုနှင့် လက်ရှိလည်ပတ်မှုကို အတည်ပြုသည်။",
  "Record analysis": "မှတ်တမ်းများကို ဆန်းစစ်ခြင်း",
  "We compare submitted information with relevant public and company records.":
    "တင်သွင်းထားသော အချက်အလက်များကို သက်ဆိုင်ရာ အများပြည်သူဆိုင်ရာနှင့် ကုမ္ပဏီမှတ်တမ်းများနှင့် နှိုင်းယှဉ်စစ်ဆေးသည်။",
  "Final review": "နောက်ဆုံးစိစစ်ခြင်း",
  "Our team completes a final credibility review before verification is granted.":
    "အတည်ပြုချက်မပေးမီ ကျွန်ုပ်တို့အဖွဲ့က ယုံကြည်စိတ်ချရမှုကို နောက်ဆုံးအကြိမ် စိစစ်သည်။",
  "Our commitment": "ကျွန်ုပ်တို့၏ ကတိကဝတ်",
  "Transparency at every step": "အဆင့်တိုင်းတွင် ပွင့်လင်းမြင်သာမှု",
  "Every verification follows the same rigorous standards.":
    "အတည်ပြုမှုတိုင်းသည် တူညီသော တင်းကျပ်သည့် စံနှုန်းများကို လိုက်နာသည်။",
  "Start verification": "အတည်ပြုမှု စတင်ရန်",
  "We’re here to help": "ကူညီပေးရန် ကျွန်ုပ်တို့ အသင့်ရှိပါသည်",
  "Let’s start a conversation.": "စကားစမြည် စတင်ကြရအောင်။",
  "Have a question about a founder profile, verification, or partnering with us? Reach out to the Founders team.":
    "တည်ထောင်သူကိုယ်ရေးအကျဉ်း၊ အတည်ပြုခြင်း သို့မဟုတ် မိတ်ဖက်ပြုခြင်းနှင့်ပတ်သက်၍ မေးခွန်းရှိပါသလား။ Founders အဖွဲ့ထံ ဆက်သွယ်ပါ။",
  "Get in touch": "ဆက်သွယ်ရန်",
  "How can we help?": "မည်သို့ ကူညီပေးရမည်နည်း။",
  "Choose the best way to reach us, or send a message using the form.":
    "ကျွန်ုပ်တို့ထံ ဆက်သွယ်ရန် အသင့်တော်ဆုံးနည်းလမ်းကို ရွေးချယ်ပါ သို့မဟုတ် ဖောင်မှတစ်ဆင့် စာပို့ပါ။",
  "Email our team": "ကျွန်ုပ်တို့အဖွဲ့ထံ အီးမေးလ်ပို့ရန်",
  "Questions about verification?":
    "အတည်ပြုခြင်းနှင့်ပတ်သက်၍ မေးခွန်းရှိပါသလား။",
  "Learn how we review founder identities and businesses.":
    "တည်ထောင်သူများ၏ အထောက်အထားနှင့် လုပ်ငန်းများကို မည်သို့စိစစ်သည်ကို လေ့လာပါ။",
  "Explore the process": "လုပ်ငန်းစဉ်ကို လေ့လာရန်",
  "Send us a message": "ကျွန်ုပ်တို့ထံ စာပို့ရန်",
  "Fill in the details below and tell us how we can help.":
    "အောက်ပါအချက်အလက်များကို ဖြည့်ပြီး မည်သို့ကူညီပေးနိုင်သည်ကို ပြောပြပါ။",
  "Your name": "သင့်အမည်",
  Name: "အမည်",
  "Email address": "အီးမေးလ်လိပ်စာ",
  "What’s this about?": "မည်သည့်အကြောင်းအရာ ဖြစ်ပါသနည်း။",
  "Select a topic": "ခေါင်းစဉ်တစ်ခု ရွေးပါ",
  "Founder profile": "တည်ထောင်သူကိုယ်ရေးအကျဉ်း",
  Partnership: "မိတ်ဖက်ပြုခြင်း",
  "Other question": "အခြားမေးခွန်း",
  "Your message": "သင့်စာ",
  "Tell us a little about how we can help...":
    "မည်သို့ကူညီပေးနိုင်သည်ကို အနည်းငယ် ပြောပြပါ...",
  "Send message": "စာပို့ရန်",
  "This demo contact form isn’t connected yet. Please email support@myanmarfoundermm.com.":
    "ဤသရုပ်ပြ ဆက်သွယ်ရန်ဖောင်ကို မချိတ်ဆက်ရသေးပါ။ support@myanmarfoundermm.com သို့ အီးမေးလ်ပို့ပါ။",
  "Account navigation": "အကောင့် လမ်းညွှန်",
  "Open account navigation": "အကောင့် လမ်းညွှန်ကို ဖွင့်ရန်",
  "Close account navigation": "အကောင့် လမ်းညွှန်ကို ပိတ်ရန်",
  "Open account menu": "အကောင့် မီနူးကို ဖွင့်ရန်",
  Search: "ရှာဖွေရန်",
  Language: "ဘာသာစကား",
  "Search founders, businesses and communities...":
    "တည်ထောင်သူများ၊ လုပ်ငန်းများနှင့် အသိုင်းအဝိုင်းများကို ရှာဖွေရန်...",
  "Search founders, businesses and communities":
    "တည်ထောင်သူများ၊ လုပ်ငန်းများနှင့် အသိုင်းအဝိုင်းများကို ရှာဖွေရန်",
  "Search Founders...": "Founders ကို ရှာဖွေရန်...",
  "Search founders, businesses, and industries": "တည်ထောင်သူများ၊ လုပ်ငန်းများနှင့် ကဏ္ဍများကို ရှာဖွေရန်",
  "Search founders, businesses, and communities": "တည်ထောင်သူများ၊ လုပ်ငန်းများနှင့် အသိုင်းအဝိုင်းများကို ရှာဖွေရန်",
  "QUICK NAVIGATION": "အမြန်လမ်းညွှန်",
  "SEARCH RESULTS": "ရှာဖွေမှုရလဒ်များ",
  "Browse founder directory": "တည်ထောင်သူစာရင်းကို ကြည့်ရန်",
  "No matching founders found.": "ကိုက်ညီသော တည်ထောင်သူ မတွေ့ပါ။",
  "No matching results found.": "ကိုက်ညီသော ရလဒ် မတွေ့ပါ။",
  "Founder community": "တည်ထောင်သူ အသိုင်းအဝိုင်း",
  "Search founders, businesses, communities...":
    "တည်ထောင်သူများ၊ လုပ်ငန်းများနှင့် အသိုင်းအဝိုင်းများကို ရှာဖွေရန်...",
  "Search communities...": "အသိုင်းအဝိုင်းများကို ရှာဖွေရန်...",
  Personal: "ကိုယ်ရေးကိုယ်တာ",
  Business: "လုပ်ငန်း",
  Community: "အသိုင်းအဝိုင်း",
  Content: "အကြောင်းအရာ",
  Overview: "ခြုံငုံသုံးသပ်ချက်",
  "My Profile": "ကျွန်ုပ်၏ ကိုယ်ရေးအကျဉ်း",
  "My Businesses": "ကျွန်ုပ်၏ လုပ်ငန်းများ",
  Verification: "အတည်ပြုခြင်း",
  Communities: "အသိုင်းအဝိုင်းများ",
  Messages: "စာတိုများ",
  "My Posts": "ကျွန်ုပ်၏ ပို့စ်များ",
  Settings: "ဆက်တင်များ",
  "Sign out": "ထွက်ရန်",
  Notifications: "အသိပေးချက်များ",
  "Your founder profile": "သင့်တည်ထောင်သူ ကိုယ်ရေးအကျဉ်း",
  "Profile completion": "ကိုယ်ရေးအကျဉ်း ပြည့်စုံမှု",
  "Add just your founder story": "သင့်တည်ထောင်သူ ဇာတ်လမ်းကို ထည့်ပါ",
  "Complete profile": "ကိုယ်ရေးအကျဉ်း ဖြည့်စွက်ရန်",
  "Thiri Aung is already verified": "သီရိအောင်ကို အတည်ပြုပြီးဖြစ်သည်",
  "View status": "အခြေအနေ ကြည့်ရန်",
  "Business status": "လုပ်ငန်းအခြေအနေ",
  "Pending workspace validation review":
    "လုပ်ငန်းနေရာ အတည်ပြုစစ်ဆေးမှုကို စောင့်ဆိုင်းနေသည်",
  "Manage businesses": "လုပ်ငန်းများကို စီမံရန်",
  "Useful next steps": "နောက်တစ်ဆင့် လုပ်ဆောင်ရန်",
  "Keep your presence active and your network close.":
    "သင့်လှုပ်ရှားမှုကို ဆက်လက်တက်ကြွစေပြီး ကွန်ရက်နှင့် နီးကပ်စွာရှိပါ။",
  "Add your founder story": "သင့်တည်ထောင်သူ ဇာတ်လမ်းကို ထည့်ရန်",
  "Show what you are building": "သင်တည်ဆောက်နေသည်များကို ပြသရန်",
  "Join a community": "အသိုင်းအဝိုင်းသို့ ဝင်ရန်",
  "Find relevant founder circles": "သက်ဆိုင်ရာ တည်ထောင်သူအဖွဲ့များကို ရှာရန်",
  "View messages": "စာတိုများ ကြည့်ရန်",
  "See conversations that need your reply":
    "သင့်ပြန်ကြားချက်လိုအပ်သော စကားဝိုင်းများကို ကြည့်ရန်",
  "From your communities": "သင့်အသိုင်းအဝိုင်းများမှ",
  "View all": "အားလုံး ကြည့်ရန်",
  "Your network": "သင့်ကွန်ရက်",
  "Events followed": "လိုက်ကြည့်ထားသော ပွဲများ",
  Upcoming: "လာမည့်အစီအစဉ်များ",
  "Good morning,": "မင်္ဂလာနံနက်ခင်းပါ၊",
  "Here is what needs your attention and what is happening in your founder network.":
    "သတိပြုရန်လိုအပ်သည်များနှင့် သင့်တည်ထောင်သူကွန်ရက်တွင် ဖြစ်ပျက်နေသည်များကို ဤနေရာတွင် ကြည့်နိုင်ပါသည်။",
  "84%": "၈၄%",
  "Profile with a founder story is more likely to attract the right connections.":
    "တည်ထောင်သူဇာတ်လမ်း ပါဝင်သော ကိုယ်ရေးအကျဉ်းသည် သင့်တော်သော ချိတ်ဆက်မှုများကို ပိုမိုရရှိစေနိုင်သည်။",
  "The strongest lesson was to watch how the work actually happens, not just ask what feature people want. Three of our early assumptions disappeared after sitting with operations teams for an afternoon.":
    "အရေးကြီးဆုံး သင်ခန်းစာမှာ လူများလိုချင်သည့် လုပ်ဆောင်ချက်ကို မေးရုံသာမက အလုပ်များ အမှန်တကယ် မည်သို့လုပ်ဆောင်နေသည်ကို လေ့လာရန်ဖြစ်သည်။ လုပ်ငန်းလည်ပတ်ရေးအဖွဲ့များနှင့် နေ့လယ်ခင်းတစ်ခု အတူရှိပြီးနောက် ကျွန်ုပ်တို့၏ အစောပိုင်းယူဆချက် သုံးခု ပျောက်ကွယ်သွားခဲ့သည်။",
  "How are founders handling logistics outside Yangon?":
    "ရန်ကုန်ပြင်ပတွင် တည်ထောင်သူများက ထောက်ပံ့ပို့ဆောင်ရေးကို မည်သို့ကိုင်တွယ်နေကြသနည်း။",
  "Recommendations for local payment integrations":
    "ပြည်တွင်းငွေပေးချေမှုစနစ် ချိတ်ဆက်မှုများအတွက် အကြံပြုချက်များ",
  "Thiri Aung · 2h": "သီရိအောင် · ၂ နာရီ",
  "Kaung Htet · 2h": "ကောင်းထက် · ၂ နာရီ",
  "Hnin Htet · Yesterday": "နှင်းထက် · မနေ့က",
  "What our first 10 customers taught us":
    "ပထမဆုံးဖောက်သည် ၁၀ ဦးထံမှ သင်ယူခဲ့ရသည်များ",
  "Yangon Founders": "ရန်ကုန် တည်ထောင်သူများ",
  "Myanmar Tech Founders": "မြန်မာ နည်းပညာတည်ထောင်သူများ",
  "Women Founders Myanmar": "မြန်မာ အမျိုးသမီးတည်ထောင်သူများ",
  "Create post": "ပို့စ် ဖန်တီးရန်",
  "View public profile": "အများမြင် ကိုယ်ရေးအကျဉ်းကို ကြည့်ရန်",
  "Edit profile": "ကိုယ်ရေးအကျဉ်း ပြင်ရန်",
  "Founder & Product Lead, Yangon":
    "တည်ထောင်သူနှင့် ထုတ်ကုန်ဦးဆောင်သူ၊ ရန်ကုန်",
  "Founder & Product Lead": "တည်ထောင်သူနှင့် ထုတ်ကုန်ဦးဆောင်သူ",
  "Tuesday, 17 June": "ဇွန်လ ၁၇ ရက်၊ အင်္ဂါနေ့",
  "Manage the businesses connected to your founder identity.":
    "သင့်တည်ထောင်သူ အကောင့်နှင့် ချိတ်ဆက်ထားသော လုပ်ငန်းများကို စီမံပါ။",
  "A product studio building simple operational software for Myanmar's growing businesses.":
    "မြန်မာနိုင်ငံရှိ တိုးတက်နေသော လုပ်ငန်းများအတွက် ရိုးရှင်းသော လုပ်ငန်းလည်ပတ်မှုဆော့ဖ်ဝဲများ တည်ဆောက်ပေးသည့် ထုတ်ကုန်စတူဒီယို။",
  "Flexible gathering and work space for small teams and independent founders.":
    "အဖွဲ့ငယ်များနှင့် သီးခြားတည်ထောင်သူများအတွက် လိုက်လျောညီထွေရှိသော တွေ့ဆုံရာနှင့် အလုပ်လုပ်ရာနေရာ။",
  "Add business": "လုပ်ငန်း ထည့်ရန်",
  "Under review": "စစ်ဆေးဆဲ",
  Edit: "ပြင်ရန်",
  Delete: "ဖျက်ရန်",
  "Business profile": "လုပ်ငန်း ကိုယ်ရေးအကျဉ်း",
  "Edit business": "လုပ်ငန်း ပြင်ရန်",
  "Business name": "လုပ်ငန်းအမည်",
  Industry: "လုပ်ငန်းကဏ္ဍ",
  Founded: "တည်ထောင်သည့်နှစ်",
  "Founded 2021": "၂၀၂၁ ခုနှစ်တွင် တည်ထောင်ခဲ့သည်",
  "Founded 2024": "၂၀၂၄ ခုနှစ်တွင် တည်ထောင်ခဲ့သည်",
  "Founded 2026": "၂၀၂၆ ခုနှစ်တွင် တည်ထောင်ခဲ့သည်",
  Location: "တည်နေရာ",
  Description: "ဖော်ပြချက်",
  "Save business": "လုပ်ငန်း သိမ်းဆည်းရန်",
  "Founder communities": "တည်ထောင်သူ အသိုင်းအဝိုင်းများ",
  "Find focused conversations and trusted peers most relevant to you.":
    "သင်နှင့် သက်ဆိုင်သော ဆွေးနွေးမှုများနှင့် ယုံကြည်ရသော မိတ်ဖက်များကို ရှာဖွေပါ။",
  "Your communities": "သင့်အသိုင်းအဝိုင်းများ",
  "Discover communities": "အသိုင်းအဝိုင်းများ ရှာဖွေရန်",
  "Focused groups across cities, industries, and founder roles.":
    "မြို့များ၊ လုပ်ငန်းကဏ္ဍများနှင့် တည်ထောင်သူအခန်းကဏ္ဍများအလိုက် အဖွဲ့များ။",
  "View community": "အသိုင်းအဝိုင်းကို ကြည့်ရန်",
  Join: "ဝင်ရန်",
  Joined: "ဝင်ရောက်ပြီး",
  members: "ဦး",
  "Cross-industry": "လုပ်ငန်းကဏ္ဍစုံ",
  Technology: "နည်းပညာ",
  Leadership: "ခေါင်းဆောင်မှု",
  Operations: "လုပ်ငန်းလည်ပတ်မှု",
  "E-commerce": "အွန်လိုင်းကုန်သွယ်ရေး",
  Fintech: "ဘဏ္ဍာရေးနည်းပညာ",
  "Exchange practical ideas and examples across industries.":
    "လုပ်ငန်းကဏ္ဍအသီးသီးမှ လက်တွေ့အသုံးဝင်သော အကြံဉာဏ်များနှင့် ဥပမာများကို ဖလှယ်ပါ။",
  "Build products, platforms, and teams in Myanmar's technology ecosystem.":
    "မြန်မာ့နည်းပညာကဏ္ဍတွင် ထုတ်ကုန်များ၊ ပလက်ဖောင်းများနှင့် အဖွဲ့များကို တည်ဆောက်ပါ။",
  "Connections, mentorship, and peer support for women founders.":
    "အမျိုးသမီးတည်ထောင်သူများအတွက် ချိတ်ဆက်မှု၊ လမ်းညွှန်မှုနှင့် အပြန်အလှန် ပံ့ပိုးမှု။",
  "Practical lessons for early-stage operations and growth.":
    "လုပ်ငန်းစတင်အဆင့် လည်ပတ်မှုနှင့် တိုးတက်မှုအတွက် လက်တွေ့သင်ခန်းစာများ။",
  "Strong stores and brands through operations and customer discussions.":
    "လုပ်ငန်းလည်ပတ်မှုနှင့် ဖောက်သည်ဆွေးနွေးမှုများမှတစ်ဆင့် အားကောင်းသော ဆိုင်များနှင့် အမှတ်တံဆိပ်များ တည်ဆောက်ပါ။",
  "A focused group for founders in payments and inclusive finance.":
    "ငွေပေးချေမှုနှင့် အားလုံးပါဝင်နိုင်သော ဘဏ္ဍာရေးကဏ္ဍမှ တည်ထောင်သူများအတွက် အဖွဲ့။",
  "Keep up with focused conversations from your founder communities.":
    "သင့်တည်ထောင်သူအသိုင်းအဝိုင်းများ၏ အဓိကဆွေးနွေးမှုများကို လိုက်လံကြည့်ရှုပါ။",
  "Community conversation": "အသိုင်းအဝိုင်း စကားဝိုင်း",
  "Write a message...": "စာတို ရေးရန်...",
  Message: "စာတို",
  Send: "ပို့ရန်",
  "That would be useful. The promises-already-made sections the part most templates miss.":
    "ဒါက အသုံးဝင်ပါလိမ့်မယ်။ ကြိုတင်ကတိပြုထားပြီးသော အပိုင်းက ပုံစံအများစုတွင် လွတ်နေတတ်သည်။",
  "Our next product review is Thursday. Happy to compare notes after.":
    "ကျွန်ုပ်တို့၏ နောက်ထုတ်ကုန်သုံးသပ်မှုကို ကြာသပတေးနေ့တွင် ပြုလုပ်ပါမည်။ ပြီးနောက် အတွေ့အကြုံများကို ဝေမျှနိုင်ပါသည်။",
  "No messages yet. Start the conversation.":
    "စာတို မရှိသေးပါ။ စကားဝိုင်းကို စတင်ပါ။",
  "Track business verification and keep private proof documents separate from public content.":
    "လုပ်ငန်းအတည်ပြုမှုကို ခြေရာခံပြီး သီးသန့်အထောက်အထားစာရွက်စာတမ်းများကို အများမြင်အကြောင်းအရာမှ ခွဲထားပါ။",
  "YOUR BUSINESSES": "သင့်လုပ်ငန်းများ",
  "This business has completed review and displays a verification badge.":
    "ဤလုပ်ငန်းကို စစ်ဆေးပြီးဖြစ်ကာ အတည်ပြုတံဆိပ် ပြသထားသည်။",
  "This business is currently under review.":
    "ဤလုပ်ငန်းကို လက်ရှိ စစ်ဆေးနေသည်။",
  "Verification timeline": "အတည်ပြုမှု အချိန်ဇယား",
  "Business profile completed": "လုပ်ငန်းကိုယ်ရေးအကျဉ်း ပြီးစီးပြီ",
  "Business proof submitted": "လုပ်ငန်းအထောက်အထား တင်သွင်းပြီး",
  "Review complete": "စစ်ဆေးမှု ပြီးစီးပြီ",
  "Review in progress": "စစ်ဆေးနေဆဲ",
  "Public details are ready for review":
    "အများမြင်အချက်အလက်များကို စစ်ဆေးရန် အသင့်ဖြစ်ပြီ",
  "Submitted 12 January 2025": "၂၀၂၅ ဇန်နဝါရီ ၁၂ ရက်တွင် တင်သွင်းခဲ့သည်",
  "Verification approved": "အတည်ပြုမှု ခွင့်ပြုပြီး",
  "The review team is checking documents":
    "စစ်ဆေးရေးအဖွဲ့က စာရွက်စာတမ်းများကို စစ်ဆေးနေသည်",
  "Private business proof": "သီးသန့်လုပ်ငန်း အထောက်အထား",
  "Visible only to you and the verification review team.":
    "သင်နှင့် အတည်ပြုစစ်ဆေးရေးအဖွဲ့သာ မြင်နိုင်သည်။",
  Private: "သီးသန့်",
  "Manage the knowledge and questions you have shared with founder communities.":
    "တည်ထောင်သူအသိုင်းအဝိုင်းများနှင့် မျှဝေထားသော ဗဟုသုတနှင့် မေးခွန်းများကို စီမံပါ။",
  posts: "ပို့စ်များ",
  "helpful reactions": "အသုံးဝင်ကြောင်း တုံ့ပြန်မှုများ",
  comments: "မှတ်ချက်များ",
  helpful: "အသုံးဝင်သည်",
  Helpful: "အသုံးဝင်သည်",
  Comment: "မှတ်ချက်ပေးရန်",
  "Post actions": "ပို့စ် လုပ်ဆောင်ချက်များ",
  "Community post": "အသိုင်းအဝိုင်း ပို့စ်",
  "What would you like to discuss?": "ဘာအကြောင်း ဆွေးနွေးလိုပါသလဲ။",
  Post: "ပို့စ်",
  "Share an insight, question, or experience...":
    "အမြင်၊ မေးခွန်း သို့မဟုတ် အတွေ့အကြုံကို မျှဝေပါ...",
  "Publish post": "ပို့စ် တင်ရန်",
  "Post created.": "ပို့စ် ဖန်တီးပြီးပါပြီ။",
  "Manage account preferences, privacy, and the local prototype.":
    "အကောင့်ဦးစားပေးမှုများ၊ ကိုယ်ရေးလုံခြုံမှုနှင့် စမ်းသပ်ဗားရှင်းကို စီမံပါ။",
  Account: "အကောင့်",
  "The email used for account notices and sign-in.":
    "အကောင့်အသိပေးချက်များနှင့် ဝင်ရောက်ရန် အသုံးပြုသော အီးမေးလ်။",
  "Account email": "အကောင့် အီးမေးလ်",
  "Choose what brings you back to Founders.":
    "Founders မှ အသိပေးစေလိုသည်များကို ရွေးချယ်ပါ။",
  "Community replies": "အသိုင်းအဝိုင်းမှ ပြန်ကြားချက်များ",
  "When someone responds to your posts or comments.":
    "သင့်ပို့စ်များ သို့မဟုတ် မှတ်ချက်များကို တစ်စုံတစ်ဦးက ပြန်ကြားသည့်အခါ။",
  "New messages": "စာတိုအသစ်များ",
  "Unread messages in a direct community chat.":
    "အသိုင်းအဝိုင်း တိုက်ရိုက်စကားဝိုင်းတွင် မဖတ်ရသေးသော စာတိုများ။",
  "Verification updates": "အတည်ပြုမှု အခြေအနေပြောင်းလဲမှုများ",
  "Change to the status of your business verification.":
    "သင့်လုပ်ငန်းအတည်ပြုမှု အခြေအနေ ပြောင်းလဲမှုများ။",
  "Profile visibility": "ကိုယ်ရေးအကျဉ်း မြင်နိုင်မှု",
  "Control whether your founder profile appears in public discovery.":
    "သင့်တည်ထောင်သူကိုယ်ရေးအကျဉ်းကို အများမြင်ရှာဖွေမှုတွင် ပြသမပြသ ထိန်းချုပ်ပါ။",
  "Public founder profile": "အများမြင် တည်ထောင်သူကိုယ်ရေးအကျဉ်း",
  "Allow people in the network to find and review your profile.":
    "ကွန်ရက်အတွင်းရှိသူများက သင့်ကိုယ်ရေးအကျဉ်းကို ရှာဖွေကြည့်ရှုနိုင်ရန် ခွင့်ပြုပါ။",
  "Prototype controls": "စမ်းသပ်ဗားရှင်း ထိန်းချုပ်မှုများ",
  "Reset local changes or leave the signed-in demo session.":
    "စက်တွင်းပြောင်းလဲမှုများကို ပြန်လည်သတ်မှတ်ရန် သို့မဟုတ် သရုပ်ပြအကောင့်မှ ထွက်ရန်။",
  "Confirm reset": "ပြန်လည်သတ်မှတ်ရန် အတည်ပြုပါ",
  "Reset demo data": "သရုပ်ပြဒေတာ ပြန်လည်သတ်မှတ်ရန်",
  "Account settings saved.": "အကောင့်ဆက်တင်များ သိမ်းဆည်းပြီးပါပြီ။",
  "Demo data reset.": "သရုပ်ပြဒေတာ ပြန်လည်သတ်မှတ်ပြီးပါပြီ။",
  "Keep your founder identity clear, current, and visible to the community.":
    "သင့်တည်ထောင်သူအချက်အလက်များကို တိကျ၊ နောက်ဆုံးအခြေအနေဖြစ်ပြီး အသိုင်းအဝိုင်းက မြင်နိုင်စေရန် ထိန်းသိမ်းပါ။",
  "Building practical software for growing teams across Myanmar":
    "မြန်မာတစ်ဝန်း တိုးတက်နေသော အဖွဲ့များအတွက် လက်တွေ့အသုံးဝင်သည့် ဆော့ဖ်ဝဲများ တည်ဆောက်နေသည်",
  "I started in product design and later met a local business owner who had spent thousands of dollars on software nobody could use.":
    "ထုတ်ကုန်ဒီဇိုင်းဖြင့် စတင်ခဲ့ပြီး နောက်ပိုင်းတွင် မည်သူမျှ အသုံးမပြုနိုင်သော ဆော့ဖ်ဝဲအတွက် ဒေါ်လာထောင်ပေါင်းများစွာ သုံးစွဲခဲ့ရသည့် ပြည်တွင်းလုပ်ငန်းရှင်တစ်ဦးနှင့် တွေ့ဆုံခဲ့သည်။",
  "Profile saved.": "ကိုယ်ရေးအကျဉ်း သိမ်းဆည်းပြီးပါပြီ။",
  "Profile photo": "ကိုယ်ရေးအကျဉ်း ဓာတ်ပုံ",
  "Personal information": "ကိုယ်ရေးအချက်အလက်",
  "Social links": "လူမှုကွန်ရက် လင့်ခ်များ",
  "Personalize how you appear across the community.":
    "အသိုင်းအဝိုင်းတွင် သင့်ပုံပန်းသဏ္ဌာန်ကို စိတ်ကြိုက်ပြင်ဆင်ပါ။",
  "Change photo": "ဓာတ်ပုံ ပြောင်းရန်",
  "This information appears throughout the network.":
    "ဤအချက်အလက်များကို ကွန်ရက်တစ်လျှောက် ပြသပါမည်။",
  "Full name": "အမည်အပြည့်အစုံ",
  Email: "အီးမေးလ်",
  Phone: "ဖုန်း",
  "Job title": "ရာထူး",
  Title: "ခေါင်းစဉ်",
  "Share what you do and let founders understand your story.":
    "သင်လုပ်ဆောင်သည်များကို မျှဝေပြီး သင့်အကြောင်းကို တည်ထောင်သူများ သိရှိစေပါ။",
  "Short bio": "အကျဉ်းမိတ်ဆက်",
  "Founder story": "တည်ထောင်သူဇာတ်လမ်း",
  "Connect": "ချိတ်ဆက်ရန်",
  "Connected": "ချိတ်ဆက်ပြီး",
  "Building": "တည်ဆောက်နေသည်",
  "Founder-led": "တည်ထောင်သူဦးဆောင်သော",
  "Local business": "ဒေသတွင်းလုပ်ငန်း",
  "Recent posts": "မကြာသေးမီ ပို့စ်များ",
  "Communities joined": "ဝင်ရောက်ထားသော အသိုင်းအဝိုင်းများ",
  "Explore founders": "တည်ထောင်သူများကို ရှာဖွေရန်",
  "Shared with the founder community": "တည်ထောင်သူအသိုင်းအဝိုင်းနှင့် မျှဝေထားသည်",
  "Public post": "အများမြင်ပို့စ်",
  "Marked helpful": "အသုံးဝင်ကြောင်း မှတ်သားပြီး",
  "Founder & Creative Lead": "တည်ထောင်သူနှင့် ဖန်တီးမှုဦးဆောင်သူ",
  "Founder": "တည်ထောင်သူ",
  "Co-founder": "ပူးတွဲတည်ထောင်သူ",
  at: "တွင်",
  "Communities are shown as a profile preview.": "အသိုင်းအဝိုင်းများကို ကိုယ်ရေးအကျဉ်း အကြိုကြည့်ရှုမှုအဖြစ် ပြသထားသည်။",
  "Mandalay Founders": "မန္တလေး တည်ထောင်သူများ",
  "Business not found": "လုပ်ငန်းကို မတွေ့ပါ",
  "This business profile is unavailable.": "ဤလုပ်ငန်းကိုယ်ရေးအကျဉ်းကို မရရှိနိုင်ပါ။",
  "Business information is shown as a profile preview.": "လုပ်ငန်းအချက်အလက်များကို ကိုယ်ရေးအကျဉ်း အကြိုကြည့်ရှုမှုအဖြစ် ပြသထားသည်။",
  Yangon: "ရန်ကုန်",
  Mandalay: "မန္တလေး",
  "Founded 2019": "၂၀၁၉ ခုနှစ်တွင် တည်ထောင်ခဲ့သည်",
  "Founded 2020": "၂၀၂၀ ခုနှစ်တွင် တည်ထောင်ခဲ့သည်",
  "Founded 2022": "၂၀၂၂ ခုနှစ်တွင် တည်ထောင်ခဲ့သည်",
  "Founded 2023": "၂၀၂၃ ခုနှစ်တွင် တည်ထောင်ခဲ့သည်",
  "The team focuses on practical service, clear communication, and building with the needs of local customers in mind.":
    "အဖွဲ့သည် လက်တွေ့ကျသော ဝန်ဆောင်မှု၊ ရှင်းလင်းသော ဆက်သွယ်မှုနှင့် ဒေသခံဖောက်သည်များ၏ လိုအပ်ချက်များကို ထည့်သွင်းစဉ်းစားကာ တည်ဆောက်ခြင်းတို့ကို အလေးထားသည်။",
  "A founder-led business helping customers find trusted products and services.":
    "ဖောက်သည်များ ယုံကြည်စိတ်ချရသော ကုန်ပစ္စည်းများနှင့် ဝန်ဆောင်မှုများကို ရှာဖွေနိုင်ရန် ကူညီပေးသော တည်ထောင်သူဦးဆောင်သည့် လုပ်ငန်း။",
  "A local service business focused on helping customers feel confident and well supported.":
    "ဖောက်သည်များ ယုံကြည်မှုရှိပြီး ကောင်းမွန်သော ပံ့ပိုးမှုရရှိစေရန် အာရုံစိုက်ထားသော ဒေသတွင်းဝန်ဆောင်မှုလုပ်ငန်း။",
  "An independent local business built around quality products and trusted customer relationships.":
    "အရည်အသွေးမြင့် ကုန်ပစ္စည်းများနှင့် ယုံကြည်စိတ်ချရသော ဖောက်သည်ဆက်ဆံရေးကို အခြေခံထားသည့် လွတ်လပ်သော ဒေသတွင်းလုပ်ငန်း။",
  "A local retail business connecting customers with dependable devices and helpful service.":
    "ဖောက်သည်များကို ယုံကြည်စိတ်ချရသော စက်ပစ္စည်းများနှင့် အထောက်အကူပြုဝန်ဆောင်မှုများနှင့် ချိတ်ဆက်ပေးသည့် ဒေသတွင်းလက်လီလုပ်ငန်း။",
  "A technology team building useful digital tools for businesses and their customers.":
    "လုပ်ငန်းများနှင့် ၎င်းတို့၏ ဖောက်သည်များအတွက် အသုံးဝင်သော ဒစ်ဂျစ်တယ်ကိရိယာများ တည်ဆောက်နေသည့် နည်းပညာအဖွဲ့။",
  "Building a practical business with a focus on understanding local customers and creating long-term value.":
    "ဒေသခံဖောက်သည်များကို နားလည်ပြီး ရေရှည်တန်ဖိုး ဖန်တီးရန် အာရုံစိုက်ကာ လက်တွေ့ကျသော လုပ်ငန်းတစ်ခု တည်ဆောက်နေသည်။",
  "Growing a customer-focused business through thoughtful service, local insight, and a commitment to quality.":
    "ဂရုတစိုက်ဝန်ဆောင်မှု၊ ဒေသတွင်းအမြင်နှင့် အရည်အသွေးအပေါ် ကတိကဝတ်တို့ဖြင့် ဖောက်သည်ကို အလေးထားသော လုပ်ငန်းကို တိုးတက်အောင် လုပ်ဆောင်နေသည်။",
  "Bringing a deep appreciation for craft and quality to a business serving customers across the region.":
    "ဒေသတစ်ဝန်းရှိ ဖောက်သည်များကို ဝန်ဆောင်မှုပေးသော လုပ်ငန်းတွင် လက်မှုပညာနှင့် အရည်အသွေးကို အလေးထားမှုကို ထည့်သွင်းထားသည်။",
  "Building a reliable local service by combining practical experience with a better customer experience.":
    "လက်တွေ့အတွေ့အကြုံနှင့် ပိုမိုကောင်းမွန်သော ဖောက်သည်အတွေ့အကြုံကို ပေါင်းစပ်ကာ ယုံကြည်စိတ်ချရသော ဒေသတွင်းဝန်ဆောင်မှုကို တည်ဆောက်နေသည်။",
  "Working with a local team to create useful technology and solve practical problems for growing businesses.":
    "တိုးတက်နေသော လုပ်ငန်းများအတွက် အသုံးဝင်သော နည်းပညာဖန်တီးရန်နှင့် လက်တွေ့ပြဿနာများကို ဖြေရှင်းရန် ဒေသတွင်းအဖွဲ့နှင့်အတူ လုပ်ဆောင်နေသည်။",
  "What building for local customers has taught me": "ဒေသခံဖောက်သည်များအတွက် တည်ဆောက်ရင်း သင်ယူခဲ့ရသည်များ",
  "A small founder breakfast next Friday": "လာမည့်သောကြာနေ့ တည်ထောင်သူများ၏ နံနက်စာတွေ့ဆုံပွဲငယ်",
  "Keeping customer trust at the heart of the business": "လုပ်ငန်း၏ အဓိကနေရာတွင် ဖောက်သည်ယုံကြည်မှုကို ထားရှိခြင်း",
  "What customers value when buying a device": "စက်ပစ္စည်းဝယ်ယူရာတွင် ဖောက်သည်များ တန်ဖိုးထားသည့်အရာများ",
  "Building useful technology, one customer at a time": "ဖောက်သည်တစ်ဦးချင်းစီအတွက် အသုံးဝင်သော နည်းပညာကို တည်ဆောက်ခြင်း",
  "Listening closely to customers and learning from their day-to-day challenges has shaped how we build and improve our business.":
    "ဖောက်သည်များကို သေချာနားထောင်ပြီး ၎င်းတို့၏ နေ့စဉ်စိန်ခေါ်မှုများမှ သင်ယူခြင်းက ကျွန်ုပ်တို့၏လုပ်ငန်းကို တည်ဆောက်ပြီး တိုးတက်အောင်လုပ်ဆောင်ပုံကို ပုံဖော်ပေးခဲ့သည်။",
  "It is always valuable to make time for honest conversations with other founders about the work, the lessons, and what comes next.":
    "လုပ်ငန်း၊ သင်ခန်းစာများနှင့် ရှေ့ဆက်လုပ်ဆောင်ရမည့်အရာများအကြောင်း အခြားတည်ထောင်သူများနှင့် ရိုးသားစွာ ဆွေးနွေးရန် အချိန်ပေးခြင်းသည် အမြဲတမ်း တန်ဖိုးရှိသည်။",
  "Clear communication, reliable service, and care for the details make a real difference in earning long-term customer trust.":
    "ရှင်းလင်းသော ဆက်သွယ်မှု၊ ယုံကြည်စိတ်ချရသော ဝန်ဆောင်မှုနှင့် အသေးစိတ်အချက်များကို ဂရုစိုက်ခြင်းတို့သည် ရေရှည်ဖောက်သည်ယုံကြည်မှု ရရှိရန် အမှန်တကယ် အရေးပါသည်။",
  "The best conversations start by understanding how someone plans to use a device, then helping them find the right option.":
    "စက်ပစ္စည်းတစ်ခုကို မည်သို့အသုံးပြုမည်ကို နားလည်ခြင်းမှ အကောင်းဆုံးစကားဝိုင်းများ စတင်ပြီး သင့်တော်သော ရွေးချယ်မှုကို ရှာဖွေပေးနိုင်သည်။",
  "The strongest product ideas come from spending time with the people who use them and making room for what we learn.":
    "အကောင်းဆုံး ထုတ်ကုန်အကြံဉာဏ်များသည် ၎င်းတို့ကို အသုံးပြုသူများနှင့် အချိန်ပေးတွေ့ဆုံပြီး သင်ယူရရှိသည့်အရာများကို ထည့်သွင်းစဉ်းစားခြင်းမှ ရရှိသည်။",
  "Help founders continue from your profile.":
    "သင့်ကိုယ်ရေးအကျဉ်းမှတစ်ဆင့် တည်ထောင်သူများက သင့်ထံ ဆက်သွယ်နိုင်ရန် ကူညီပါ။",
  LinkedIn: "LinkedIn",
  Website: "ဝဘ်ဆိုက်",
  "Save changes": "ပြောင်းလဲမှုများ သိမ်းဆည်းရန်",
};

function getLanguage(): Language {
  return localStorage.getItem(LANGUAGE_KEY) === "MM" ? "MM" : "EN";
}

function subscribe(listener: () => void) {
  window.addEventListener(LANGUAGE_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(LANGUAGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function useLanguage() {
  const language = useSyncExternalStore<Language>(
    subscribe,
    getLanguage,
    () => "EN",
  );
  function select(next: Language) {
    localStorage.setItem(LANGUAGE_KEY, next);
    window.dispatchEvent(new Event(LANGUAGE_EVENT));
  }
  return { language, select };
}

function translateText(text: string, language: Language) {
  if (language !== "MM") return text;
  const leading = text.match(/^\s*/)?.[0] ?? "";
  const trailing = text.match(/\s*$/)?.[0] ?? "";
  const content = text.slice(leading.length, text.length - trailing.length);
  if (!content) return text;
  return `${leading}${burmese[content] ?? content}${trailing}`;
}

const translatableAttributes = new Set([
  "aria-label",
  "placeholder",
  "title",
  "alt",
]);
const translatableProps = new Set(["description"]);

function translateNode(node: ReactNode, language: Language): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === "string") return translateText(child, language);
    if (
      !isValidElement<{ children?: ReactNode; [key: string]: unknown }>(child)
    )
      return child;

    const props = { ...child.props };
    for (const attribute of [...translatableAttributes, ...translatableProps]) {
      const value = props[attribute];
      if (typeof value === "string")
        props[attribute] = translateText(value, language);
    }
    props.children = translateNode(props.children, language);
    return cloneElement(child, props);
  });
}

export function Localized({ children }: { children: ReactNode }) {
  const { language }: { language: Language } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language === "MM" ? "my" : "en";
  }, [language]);
  return <>{translateNode(children, language)}</>;
}

export function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { language, select } = useLanguage();
  return (
    <div
      className={`language-switch${compact ? " compact" : ""}`}
      role="group"
      aria-label={language === "MM" ? "ဘာသာစကား" : "Language"}
    >
      <button
        type="button"
        className={language === "EN" ? "active" : ""}
        aria-pressed={language === "EN"}
        onClick={() => select("EN")}
      >
        EN
      </button>
      <button
        type="button"
        className={language === "MM" ? "active" : ""}
        aria-pressed={language === "MM"}
        onClick={() => select("MM")}
      >
        MM
      </button>
    </div>
  );
}
