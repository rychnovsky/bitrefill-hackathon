# Bitrefill Gifter

_Reward your Farcaster community members with real-world value!_

---

## **📌 Description**

**Bitrefill Gifter** is a social mini-app designed for Farcaster communities. It enables users to reward their channel members or followers with Bitrefill gift cards. Users can select a specific channel and define recipient selection criteria, starting with random selection, with more advanced filters to come. This makes it seamless and fun to appreciate and engage their audience with crypto-native, real-world rewards.

---

## **❓ Problem & Solution**

### **Problem**

Farcaster has thriving communities, but no built-in system for recognizing or rewarding meaningful engagement with tangible value. Community builders lack easy tools to incentivize participation or show appreciation to members.

### **Solution**

Bitrefill Gifter brings automated, programmable gifting into Farcaster. It connects directly to Bitrefill accounts and allows users to send gift cards (e.g., Uber, Airbnb, mobile data) to Farcaster users based on channel membership or follower status—starting with random giveaways and expanding to more advanced reward logic, such as engagement scoring, milestone-based, etc.

---

## **🎯 Target Audience**

- Farcaster channel owners and moderators
- Crypto-native influencers and creators
- Community managers looking to boost engagement
- DAOs and projects rewarding community participation

---

## **🔁 User Flow**

1. User enters their Bitrefill API key (once the API enables that, they will log in with their credentials via OAuth)
2. User selects a channel and defines targeting criteria (e.g., followers vs members).
3. The app fetches their Farcaster channels details and full list of followers / members using Warpcast API.
4. App randomly selects recipients based on the predefined rules.
5. App shows details of the selected user fetched from Neynar API.
6. Bitrefill API is used to issue and deliver gift cards. The balance of the connected account is used to pay for the gift card.
7. Resulting gift is posted back to the feed, optionally with a shoutout (“@frens was just gifted!”).

---

## **🧰 Technical Stack**

- **Frontend**: Next.js + TypeScript + Tailwind CSS (Farcaster miniapp-capable)
- **Backend**: Node.js/Express (via Next.js API routes)
- **Farcaster Integration**: Neynar API for FID/channel/member resolution, Farcaster API for channel members.
- **Bitrefill API**: Used for authenticated gift card purchase and issuance
- **Deployment**: Vercel
- **Delivery**: Farcaster MiniApp

---

## **🛣 Future Plans**

- Add more recipient filters: most active users, engagement scoring, milestone-based gifts
- Support multiple gift card types per reward pool
- Custom messages, branded themes for the gifter post
- Analytics dashboard: track gifting ROI, campaign performance
- Scheduled/recurring gifting (e.g., “Reward top 3 each Friday”)
- Allow DAOs/projects to preload a gift pool and automate distribution via treasury

---

## **🔚 Conclusion**

**Bitrefill Gifter** seamlessly connects Farcaster’s social layer with Bitrefill’s powerful real-world commerce engine. It enables meaningful, automated engagement at scale by bridging community interaction with real-life value. As Farcaster grows, tools like this will help creators and communities thrive by making crypto-native social rewarding, personal, and tangible.

---

## **Links**

- [Technical Documentation](README.tech.md)
