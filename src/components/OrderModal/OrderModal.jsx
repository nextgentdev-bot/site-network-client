import { useState } from 'react';

const NICHE_PRICES = { general: 70, special: 110 };
const ARTICLE_WRITING_PRICE = 10;

const OrderModal = ({ site, onClose, onSubmit }) => {
    const [nicheCategory, setNicheCategory] = useState('general');
    const [orderType, setOrderType] = useState('guestpost');
    const [linkType, setLinkType] = useState('dofollow');
    const [docLink, setDocLink] = useState('');
    const [uploadedDocName, setUploadedDocName] = useState('');
    const [uploadedImageName, setUploadedImageName] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [articleWriting, setArticleWriting] = useState(false);
    const [error, setError] = useState('');

    const total = NICHE_PRICES[nicheCategory] + (articleWriting ? ARTICLE_WRITING_PRICE : 0);

    const handleAddToCart = () => {
        // content requirement: doc link, uploaded doc, বা article writing service — এর যেকোনো একটা লাগবে
        const hasContent = docLink.trim() || uploadedDocName || articleWriting;
        if (!hasContent) {
            setError('Google Doc link, uploaded doc, অথবা Article Writing এর যেকোনো একটা দরকার।');
            return;
        }
        setError('');

        // এই object টাই "collected information" — parent এ পাঠানো হচ্ছে
        const order = {
            website: site.name,
            nicheCategory,
            orderType,
            linkType,
            docLink: docLink.trim() || null,
            uploadedDocName: uploadedDocName || null,
            uploadedImageName: uploadedImageName || null,
            specialInstructions: specialInstructions.trim() || null,
            articleWriting,
            total,
        };

        onSubmit(order);
        onClose();
    };

    if (!site) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-xl bg-white text-gray-900 p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                    ✕
                </button>

                <h2 className="text-lg font-bold pr-8">
                    Order from <span className="text-orange-500">{site.name}</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Configure the publisher's details and your order requirements.
                </p>

                {/* stats */}
                <div className="grid grid-cols-4 gap-2 mt-5">
                    <div className="rounded-lg bg-gray-100 text-center py-2">
                        <div className="text-[10px] text-gray-500">DA</div>
                        <div className="font-bold">{site.da}</div>
                    </div>
                    <div className="rounded-lg bg-gray-100 text-center py-2">
                        <div className="text-[10px] text-gray-500">DR</div>
                        <div className="font-bold">{site.dr}</div>
                    </div>
                    <div className="rounded-lg bg-gray-100 text-center py-2">
                        <div className="text-[10px] text-gray-500">TRAFFIC</div>
                        <div className="font-bold">{site.trafficLabel}</div>
                    </div>
                    <div className="rounded-lg bg-gray-100 text-center py-2">
                        <div className="text-[10px] text-gray-500">LINKS/POST</div>
                        <div className="font-bold">{site.backlinks}</div>
                    </div>
                </div>

                {/* niche tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {site.niches.map((n) => (
                        <span key={n} className="px-2 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-medium">
                            {n}
                        </span>
                    ))}
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                        {site.country}
                    </span>
                </div>

                {/* Niche category */}
                <div className="mt-5">
                    <label className="text-xs font-semibold text-gray-500 tracking-wide">NICHE CATEGORY</label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <button
                            onClick={() => setNicheCategory('general')}
                            className={`rounded-lg border-2 p-3 text-left transition ${
                                nicheCategory === 'general' ? 'border-orange-400' : 'border-gray-200'
                            }`}
                        >
                            <div className="font-semibold text-sm">General Niches</div>
                            <div className="text-green-600 font-bold">${NICHE_PRICES.general}</div>
                        </button>
                        <button
                            onClick={() => setNicheCategory('special')}
                            className={`rounded-lg border-2 p-3 text-left transition ${
                                nicheCategory === 'special' ? 'border-orange-400' : 'border-gray-200'
                            }`}
                        >
                            <div className="font-semibold text-sm">Special Niches</div>
                            <div className="text-green-600 font-bold">${NICHE_PRICES.special}</div>
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Special niches (e.g. crypto, CBD, gambling) are priced higher. Adult content is not accepted.
                    </p>
                </div>

                {/* Order type */}
                <div className="mt-5">
                    <label className="text-xs font-semibold text-gray-500 tracking-wide">ORDER TYPE</label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <button
                            onClick={() => setOrderType('guestpost')}
                            className={`rounded-lg border-2 p-3 text-sm font-semibold transition ${
                                orderType === 'guestpost' ? 'border-orange-400' : 'border-gray-200'
                            }`}
                        >
                            Guest Post
                        </button>
                        <button
                            onClick={() => setOrderType('linkinsertion')}
                            className={`rounded-lg border-2 p-3 text-sm font-semibold transition ${
                                orderType === 'linkinsertion' ? 'border-orange-400' : 'border-gray-200'
                            }`}
                        >
                            Link Insertion
                        </button>
                    </div>
                </div>

                {/* Link type */}
                <div className="mt-5">
                    <label className="text-xs font-semibold text-gray-500 tracking-wide">LINK TYPE</label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                        {['dofollow', 'nofollow', 'sponsored'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setLinkType(t)}
                                className={`rounded-lg border-2 py-2 text-sm font-semibold capitalize transition ${
                                    linkType === t ? 'border-orange-400' : 'border-gray-200'
                                }`}
                            >
                                {t === 'nofollow' ? 'NoFollow' : t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Google doc link */}
                <div className="mt-5">
                    <label className="text-xs font-semibold text-gray-500 tracking-wide">
                        GOOGLE DOC / SHEET LINK{' '}
                        <span className="text-red-500 font-normal">(required — or upload a doc)</span>
                    </label>
                    <input
                        type="text"
                        value={docLink}
                        onChange={(e) => setDocLink(e.target.value)}
                        placeholder="https://docs.google.com/document/..."
                        className="w-full mt-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Paste your ready content link or upload a doc below — one of the two is required. Or enable
                        Article Writing and we'll write it.
                    </p>
                </div>

                {/* uploads */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 tracking-wide">
                            UPLOAD DOC <span className="text-red-500 font-normal">(required — or paste a link)</span>
                        </label>
                        <div className="mt-2 flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-2">
                            <label className="px-3 py-1 rounded bg-orange-100 text-orange-600 text-xs font-semibold cursor-pointer whitespace-nowrap">
                                Choose File
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => setUploadedDocName(e.target.files[0]?.name || '')}
                                />
                            </label>
                            <span className="text-xs text-gray-400 truncate">
                                {uploadedDocName || 'No file chosen'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 tracking-wide">
                            UPLOAD IMAGE <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <div className="mt-2 flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-2">
                            <label className="px-3 py-1 rounded bg-orange-100 text-orange-600 text-xs font-semibold cursor-pointer whitespace-nowrap">
                                Choose File
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setUploadedImageName(e.target.files[0]?.name || '')}
                                />
                            </label>
                            <span className="text-xs text-gray-400 truncate">
                                {uploadedImageName || 'No file chosen'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* special instructions */}
                <div className="mt-5">
                    <label className="text-xs font-semibold text-gray-500 tracking-wide">
                        SPECIAL INSTRUCTIONS <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Anchor text, target URL, tone, image needs..."
                        rows={3}
                        className="w-full mt-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 resize-none"
                    />
                </div>

                {/* extra services */}
                <div className="mt-5">
                    <label className="text-xs font-semibold text-gray-500 tracking-wide">EXTRA SERVICES</label>
                    <label className="mt-2 flex items-start gap-3 border border-gray-200 rounded-lg p-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={articleWriting}
                            onChange={(e) => setArticleWriting(e.target.checked)}
                            className="mt-1"
                        />
                        <div className="flex-1">
                            <div className="text-sm font-semibold">Article Writing</div>
                            <div className="text-xs text-gray-400">
                                We research & write the post — you give us the topic & keywords.
                            </div>
                        </div>
                        <div className="text-green-600 font-bold text-sm">+${ARTICLE_WRITING_PRICE}</div>
                    </label>
                </div>

                {error && <p className="text-red-500 text-xs mt-3">{error}</p>}

                {/* footer */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div>
                        <div className="text-xs text-gray-400">TOTAL</div>
                        <div className="text-xl font-bold text-green-600">${total}</div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-400 text-white text-sm font-semibold hover:bg-orange-500"
                        >
                            🛒 Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;