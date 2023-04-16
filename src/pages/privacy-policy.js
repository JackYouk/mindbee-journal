import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";

export default function PrivacyPolicy() {
    const router = useRouter();
    return(
        <>
            <Navbar />
            <div className="min-h-[100dvh] bg-gray-800 text-gray-300 p-6 pt-20">
                <div onClick={() => router.back()} className="btn btn-sm  rounded text-gray-800 bg-gray-300 normal-case">Back</div>
                <div className="text-xs breadcrumbs">
                    <ul>
                        <li><a onClick={() => router.back()}>Home</a></li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <h2 className="text-2xl font-bold mb-2">Privacy Policy</h2>
                <p className="font-bold mb-2">Last updated: 4/15/2023</p>
                <p className="mb-2">This is a demo website, created for the purpose of the Laney College Hackathon.</p>
                <p className="mb-2">This Privacy Policy outlines our policies regarding the collection, use, and disclosure of personal information when you use our Service, and your choices regarding your data.</p>
                <p className="mb-5">By using the Service, you agree to the collection and use of information in accordance with this policy.</p>
                <h3 className="text-xl font-bold mb-2">Information Collection and Use</h3>
                <p className="mb-2">While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to, your name, email address, phone number, and other information ("Personal Information").</p>
                <p className="mb-5">We collect this information for the purpose of providing the service, identifying and communicating with you, and improving our algorithms and overall user experience.</p>
                <h3 className="text-xl font-bold mb-2">Use of Personal Information</h3>
                <p>We use your Personal Information to:</p>
                <ul className="mb-5 ml-6 list-disc">
                    <li>Provide, maintain, and improve our service.</li>
                    <li>Communicate with you about our service, including updates and customer support.</li>
                    <li>Improve our algorithms and personalize your experience on our website.</li>
                </ul>
                <h3 className="text-xl font-bold mb-2">Data Retention</h3>
                <p className="mb-5">We will retain your Personal Information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.</p>
                <h3 className="text-xl font-bold mb-2">Security</h3>
                <p className="mb-5">The security of your Personal Information is important to us. We strive to use commercially acceptable means to protect your Personal Information, but we cannot guarantee its absolute security. Any transmission of personal information is at your own risk.</p>
                <h3 className="text-xl font-bold mb-2">Changes to This Privacy Policy</h3>
                <p className="mb-2">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this policy.</p>
                <p className="mb-5">You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
                <h3 className="text-xl font-bold mb-2">Contact Us</h3>
                <p className="mb-5">If you have any questions or concerns about this Privacy Policy, please contact us by emailing <a href="mailto:example@email.com" target='_blank' className="link">example@email.com</a>.</p>
            </div>
        </>
    );
}