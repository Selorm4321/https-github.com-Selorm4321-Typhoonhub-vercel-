export interface VideoData {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
    firebaseStoragePath: string;
    category: string;
    price?: number;
    rentalPrice?: number;
    creatorPaypal?: string;
}

export const videos: VideoData[] = [
    // Global Cinema Series
    {
        id: "gc-1",
        title: "Global Cinema Episode 1",
        description: "Experience the first episode of our Global Cinema series.",
        firebaseStoragePath: "videos episodes/Global Cenima Episode 1/Global Cenima Episode 1.mov",
        category: "Global Cinema",
        thumbnail: "/images/thumbnails/global-cinema-generic.png"
    },
    {
        id: "gc-2",
        title: "Global Cinema Episode 2",
        description: "The journey continues in the second episode of Global Cinema.",
        firebaseStoragePath: "videos episodes/Global Cinema Episode 2/Global Cinema Episode 2 .mov",
        category: "Global Cinema",
        thumbnail: "/images/thumbnails/global-cinema-2.png"
    },
    {
        id: "gc-3",
        title: "Global Cinema Episode 3",
        description: "Global Cinema Episode 3 brings you more independent storytelling.",
        firebaseStoragePath: "videos episodes/Global Cinema Episode 3/Global Cinema Episode 3.mov",
        category: "Global Cinema",
        thumbnail: "/images/thumbnails/global-cinema-3.png"
    },
    {
        id: "gc-4",
        title: "Global Cinema Episode 4",
        description: "Watch the fourth installment of the Global Cinema series.",
        firebaseStoragePath: "videos episodes/Global Cinema Episode 4/Global Cinema Episode 4.mp4",
        category: "Global Cinema",
        thumbnail: "/images/thumbnails/global-cinema-4.png"
    },

    // Legends of Legacy Series
    {
        id: "lol-sancho",
        title: "Ignatius Sancho",
        description: "The story of Ignatius Sancho, a Legend of Legacy.",
        firebaseStoragePath: "videos episodes/Legends of Legacy Episodes/Ignatius Sancho/Typhoonhub Presents_ Ignatius Sancho_2025_11_16(1).mp4",
        thumbnail: "videos episodes/Legends of Legacy Episodes/Ignatius Sancho/thumbnail for site/6NeRDLTf.png",
        category: "Legends of Legacy"
    },
    {
        id: "lol-mahoney",
        title: "Mary Eliza Mahoney",
        description: "Discover the life of Mary Eliza Mahoney.",
        firebaseStoragePath: "videos episodes/Legends of Legacy Episodes/Mary Eliza Mahoney/Mary Eliza Mahoney .mp4",
        category: "Legends of Legacy",
        thumbnail: "/images/thumbnails/mary-eliza-mahoney.png"
    },
    {
        id: "lol-evans",
        title: "Matilda C. Evans",
        description: "First African American Woman Physician in South Carolina.",
        firebaseStoragePath: "videos episodes/Legends of Legacy Episodes/Matilda C. Evans First African American Woman Physician in South Carolina/Matilda C. Evans – Healing. Advancing. Inspiring..mov",
        thumbnail: "videos episodes/Legends of Legacy Episodes/Matilda C. Evans First African American Woman Physician in South Carolina/thumbnail/DR Matilda C Evans.png",
        category: "Legends of Legacy"
    },
    {
        id: "lol-mccoy",
        title: "The Real McCoy",
        description: "Learn about the Real McCoy.",
        firebaseStoragePath: "videos episodes/Legends of Legacy Episodes/The Real McCoy/The-RealMcCoy-Web1080p.mp4",
        category: "Legends of Legacy",
        thumbnail: "/images/thumbnails/legends-of-legacy-generic.png"
    },

    // Typhoonhub Film
    {
        id: "tf-alice",
        title: "Alice and Huck",
        description: "A Typoonhub Film production.",
        firebaseStoragePath: "videos episodes/Typhoonhub Film/Alice and Huck/Alice and Huck Video/Alice And Huck.mp4",
        category: "Typhoonhub Film",
        thumbnail: "/images/thumbnails/alice-and-huck.png"
    },
    {
        id: "tf-harbinger",
        title: "Harbinger Custom Bikes",
        description: "Features Harbinger Custom Bikes.",
        firebaseStoragePath: "videos episodes/Typhoonhub Film/HARBINGER CUSTOM BIKES/HARBINGER CUSTOM BIKES Video/HARBINGER CUSTOM BIKES (TYPHOON TV).mp4",
        category: "Typhoonhub Film",
        thumbnail: "/images/thumbnails/harbinger-custom-bikes.png"
    },
    {
        id: "tf-gentlemen",
        title: "Distinguished Gentlemans Ride",
        description: "Harbinger Customs Distinguished Gentlemans Ride.",
        firebaseStoragePath: "videos episodes/Typhoonhub Film/HARBINGER CUSTOM BIKES/HARBINGER CUSTOMS DISTINGUISHED GENTLEMENS RIDE Video/HARBINGER CUSTOMS DISTINGUISHED GENTLEMENS RIDE (1).mp4",
        category: "Typhoonhub Film",
        thumbnail: "/images/thumbnails/distinguished-gentlemans-ride.png"
    },
    {
        id: "tf-lucky",
        title: "Lucky",
        description: "A short film.",
        firebaseStoragePath: "videos episodes/Typhoonhub Film/Lucky/Lucky Video/Lucky (1).mp4",
        category: "Typhoonhub Film",
        thumbnail: "/images/thumbnails/typhoonhub-film-generic.png"
    },
    {
        id: "tf-mami",
        title: "Mami",
        description: "A short film.",
        firebaseStoragePath: "videos episodes/Typhoonhub Film/Mami/Mami Video/MAMI (1).mp4",
        category: "Typhoonhub Film",
        thumbnail: "/images/thumbnails/mami.png"
    },
    {
        id: "tf-newday",
        title: "New Day",
        description: "A short film.",
        firebaseStoragePath: "videos episodes/Typhoonhub Film/New Day/New Day video/New Day (1).mp4",
        category: "Typhoonhub Film",
        thumbnail: "/images/thumbnails/typhoonhub-film-generic.png"
    },
    {
        id: "tf-art-indie-1",
        title: "The Art of Indie: Ep 1",
        description: "Exploring Creativity with Nikki Wallin.",
        firebaseStoragePath: "videos episodes/Typhoonhub Film/The Art Of Indie _ Ep. 1_ Exploring Creativity with Nikki Wallin (1)/The Art Of Indie _ Ep. 1_ Exploring Creativity with Nikki Wallin (1) Video/The Art Of Indie _ Ep. 1_ Exploring Creativity with Nikki Wallin (1).mp4",
        category: "Typhoonhub Film",
        thumbnail: "/images/thumbnails/typhoonhub-film-generic.png"
    },
    {
        id: "tf-art-indie-2",
        title: "The Art of Indie: Ep 2",
        description: "Comedy Gold with Devon Ferguson.",
        firebaseStoragePath: "videos episodes/Typhoonhub Film/The Art Of Indie | Episode #2: Comedy Gold with Devon Ferguson/The Art Of Indie | Episode #2: Comedy Gold with Devon Ferguson Video/🎬 The Art Of Indie _ Episode #2_ Comedy Gold with Devon Ferguson 🎤.mp4",
        category: "Typhoonhub Film",
        thumbnail: "/images/thumbnails/typhoonhub-film-generic.png"
    },
    {
        id: "tf-stigma",
        title: "Breaking the Stigma",
        description: "Typhoon Talk: Break the Stigma.",
        firebaseStoragePath: "videos episodes/Typhoonhub Film/Typhoonhub breaking the Stigma/Typhoonhub breaking the Stigma Video/Typhoon Talk  Break the Stigma.mp4",
        category: "Typhoonhub Film",
        thumbnail: "/images/thumbnails/typhoonhub-film-generic.png"
    },
    {
        id: "tf-jesse",
        title: "When Jesse Was Born",
        description: "A short film.",
        firebaseStoragePath: "videos episodes/Typhoonhub Film/When Jesse Was Born/When Jesse Was Born   Video/When Jesse was Born.mp4",
        category: "Typhoonhub Film",
        thumbnail: "/images/thumbnails/typhoonhub-film-generic.png"
    },
    {
        id: "tf-masks",
        title: "Voice of Waste Masks",
        description: "jwohnjovouchor and the Yiiiii Kakai.",
        firebaseStoragePath: "videos episodes/Typhoonhub Film/jwohnjovouchor and the Yiiiii Kakai Voice of Waste Masks/jwohnjovouchor and the Yiiiii Kakai Voice of Waste Masks Video/jwohnjovouchor and the Yiiiii Kakai Voice of Waste Masks (1).mp4",
        category: "Typhoonhub Film",
        thumbnail: "/images/thumbnails/typhoonhub-film-generic.png"
    }
];
