import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import CreateAgreement from "./CreateAgreement";
import Agreement from "./Agreement";
import Loader from "../utils/Loader";
import {NotificationError, NotificationSuccess} from "../utils/Notifications";
import {buyProductAction, createProductAction, deleteProductAction, getProductsAction,} from "../../utils/marketplace";
import PropTypes from "prop-types";
import {Row} from "react-bootstrap";

const SocialCampaignAgreement = ({address, fetchBalance}) => {
    const [campaignAgreement, setCampaignAgreement] = useState([]);
    const [loading, setLoading] = useState(false);

    const getCampaignAgreements = async () => {
        setLoading(true);
        getProductsAction()
            .then(products => {
                if (products) {
                    setCampaignAgreement(products);
                }
            })
            .catch(error => {
                console.log(error);
            })
            .finally(_ => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getCampaignAgreements();
    }, []);

    const createCampaignAgreement = async (data) => {
        setLoading(true);
        createProductAction(address, data)
            .then(() => {
                toast(<NotificationSuccess text="Agreement added successfully."/>);
                getCampaignAgreements();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error);
                toast(<NotificationError text="Failed to create a Agreement."/>);
                setLoading(false);
            })
    };

    const makePaymentToCreator = async (product, count) => {
        setLoading(true);
        buyProductAction(address, product, count)
            .then(() => {
                toast(<NotificationSuccess text="Product bought successfully"/>);
                getCampaignAgreements();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to purchase product."/>);
                setLoading(false);
            })
    };

    // const deleteProduct = async (product) => {
    //     setLoading(true);
    //     deleteProductAction(address, product.appId)
    //         .then(() => {
    //             toast(<NotificationSuccess text="Product deleted successfully"/>);
    //             getCampaignAgreements();
    //             fetchBalance(address);
    //         })
    //         .catch(error => {
    //             console.log(error)
    //             toast(<NotificationError text="Failed to delete product."/>);
    //             setLoading(false);
    //         })
    // };

    if (loading) {
        return <Loader/>;
    }
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fs-4 fw-bold mb-0">Social Media Marketing Payment</h1>
                <CreateAgreement createAgreement={createCampaignAgreement}/>
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
                <>
                    {campaignAgreement.map((product, index) => (
                        <Agreement
                            address={address}
                            product={product}
                            buyProduct={makePaymentToCreator}
                            key={index}
                        />
                    ))}
                </>
            </Row>
        </>
    );
};

SocialCampaignAgreement.propTypes = {
    address: PropTypes.string.isRequired,
    fetchBalance: PropTypes.func.isRequired
};

export default SocialCampaignAgreement;
