
import { useEffect, useState } from "react";
import {
  Search,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  Trash2,
  User,
} from "lucide-react";

const defaultReviews = [
  {
    id: 1,
    customer: "Rahul Patel",
    product: "Wireless Headphones",
    rating: 5,
    comment: "Excellent sound quality. Very comfortable to use.",
    date: "2026-11-10",
    status: "Approved",
  },
  {
    id: 2,
    customer: "Priya Sharma",
    product: "Smart Watch",
    rating: 4,
    comment: "Good product and battery backup is also nice.",
    date: "2026-11-12",
    status: "Pending",
  },
  {
    id: 3,
    customer: "Amit Shah",
    product: "Running Shoes",
    rating: 3,
    comment: "Product is good but delivery was late.",
    date: "2026-11-14",
    status: "Pending",
  },
  {
    id: 4,
    customer: "Neha Patel",
    product: "Bluetooth Speaker",
    rating: 5,
    comment: "Amazing sound and excellent product quality.",
    date: "2026-11-15",
    status: "Rejected",
  },
];

function Reviews() {
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem("adminReviews");
      return saved ? JSON.parse(saved) : defaultReviews;
    } catch {
      return defaultReviews;
    }
  });

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    try {
      localStorage.setItem("adminReviews", JSON.stringify(reviews));
    } catch (error) {
      console.error("Unable to save reviews:", error);
    }
  }, [reviews]);

  const updateStatus = (id, status) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, status } : review
      )
    );
  };

  const deleteReview = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews((prev) => prev.filter((review) => review.id !== id));
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const searchMatch =
      review.customer.toLowerCase().includes(search.toLowerCase()) ||
      review.product.toLowerCase().includes(search.toLowerCase()) ||
      review.comment.toLowerCase().includes(search.toLowerCase());

    const ratingMatch =
      ratingFilter === "All" || review.rating === Number(ratingFilter);

    const statusMatch =
      statusFilter === "All" || review.status === statusFilter;

    return searchMatch && ratingMatch && statusMatch;
  });

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((total, review) => total + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  const pendingCount = reviews.filter(
    (review) => review.status === "Pending"
  ).length;

  const approvedCount = reviews.filter(
    (review) => review.status === "Approved"
  ).length;

  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Reviews Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and monitor customer product reviews.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reviews</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {reviews.length}
              </h2>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <MessageSquare size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <h2 className="mt-2 text-2xl font-bold text-yellow-500">
                {averageRating} / 5
              </h2>
            </div>
            <div className="rounded-lg bg-yellow-100 p-3 text-yellow-500">
              <Star size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Reviews</p>
              <h2 className="mt-2 text-2xl font-bold text-orange-500">
                {pendingCount}
              </h2>
            </div>
            <div className="rounded-lg bg-orange-100 p-3 text-orange-500">
              <MessageSquare size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved Reviews</p>
              <h2 className="mt-2 text-2xl font-bold text-green-600">
                {approvedCount}
              </h2>
            </div>
            <div className="rounded-lg bg-green-100 p-3 text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-semibold text-gray-800">
            Customer Reviews
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search reviews..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border py-2 pl-10 pr-4 outline-none focus:border-blue-500 sm:w-56"
              />
            </div>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Rating</th>
                <th className="px-5 py-4">Review</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                        <User size={17} />
                      </div>
                      <span className="font-medium text-gray-800">
                        {review.customer}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {review.product}
                  </td>

                  <td className="px-5 py-4">
                    {renderStars(review.rating)}
                  </td>

                  <td className="max-w-xs px-5 py-4 text-sm text-gray-600">
                    {review.comment}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {review.date}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        review.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : review.status === "Pending"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {review.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {review.status !== "Approved" && (
                        <button
                          onClick={() => updateStatus(review.id, "Approved")}
                          title="Approve Review"
                          className="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100"
                        >
                          <CheckCircle size={17} />
                        </button>
                      )}

                      {review.status !== "Rejected" && (
                        <button
                          onClick={() => updateStatus(review.id, "Rejected")}
                          title="Reject Review"
                          className="rounded-lg bg-orange-50 p-2 text-orange-600 hover:bg-orange-100"
                        >
                          <XCircle size={17} />
                        </button>
                      )}

                      <button
                        onClick={() => deleteReview(review.id)}
                        title="Delete Review"
                        className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReviews.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
