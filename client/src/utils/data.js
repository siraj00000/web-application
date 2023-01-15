// MUI ICONS
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

export const CONNECTS = [
    {
        Service: "Whatsapp",
        Icon: WhatsAppIcon,
        enableKey: "whatsapp_support",
        info: "whatsapp_number",
        asset: require("../assets/Product/whatsapp_people.jpg")
    },
    {
        Service: "Email",
        Icon: MailOutlineIcon,
        enableKey: "email_support",
        info: "email_id",
        asset: require("../assets/Product/instagram_people.jpg")
    },
    {
        Service: "Call",
        Icon: LocalPhoneIcon,
        enableKey: "call_support",
        info: "call_no",
        asset: require("../assets/Product/twitter_people.jpg")
    },
    {
        Service: "Instagram",
        Icon: InstagramIcon,
        enableKey: "instagram",
        info: "insta_link",
        asset: require("../assets/Product/instagram_people.jpg")
    },
    {
        Service: "facebook",
        Icon: FacebookIcon,
        enableKey: "facebook",
        info: "fb_link",
        asset: require("../assets/Product/whatsapp_people.jpg")
    },
];

export const WARRANTY_FORM_GRID = [
    {
        label: "Store & Location",
        name: "store_name_and_address",
        type: "text",
        placeholder: "friends bakery block 34 DHA",
        required: true,
    },
    {
        label: "Store Pin Code",
        name: "store_pin_code",
        type: "tel",
        placeholder: "323272",
        required: true,
    },
    {
        label: "Warranty Duration",
        name: "warranty_duration",
        type: "text",
        placeholder: "3month, 4mon..",
        required: true,
    },
    {
        label: "Purchase Date",
        name: "purchase_date",
        type: "date",
        required: true,
    },
    {
        label: "Invoice Number",
        name: "invoice_number",
        type: "text",
        placeholder: "09Inv2200",
        required: true,
    },
    {
        label: "Pincode",
        name: "pincode",
        type: "text",
        placeholder: "239230",
        required: true,
    },
    {
        label: "Address 01",
        name: "address1",
        type: "text",
        placeholder: "Office",
        required: false,
    },
    {
        label: "Address 02",
        name: "address2",
        type: "text",
        placeholder: "house",
        required: false,
    },
];