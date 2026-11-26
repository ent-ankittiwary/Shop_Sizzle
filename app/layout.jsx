import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";
import {
  ClerkProvider} from "@clerk/nextjs";
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
  title: "GoCart. - Shop smarter",
  description: "GoCart. - Shop smarter",
};

  const imageKitUrlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;


export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased`}>
           <ImageKitProvider urlEndpoint={imageKitUrlEndpoint ?? ""}>
          <StoreProvider>
            <Toaster />
            {children}
          </StoreProvider>
          </ImageKitProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
