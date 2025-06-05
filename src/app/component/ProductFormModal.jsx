"use client";

import React from "react";

export default function ProductFormModal({
    title,
    onSubmit,
    onClose,
    submitText,
    formData,
    handleInputChange,
    loading
    }) {
    return (
        <div onClick={closeModals}>
            <div>
            <h2>{title}</h2>
            <button onClick={closeModals}></button>
            </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Director*</label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Rating (0-100)*</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Duration (minutes)*</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Release Date*</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Genres (comma separated)</label>
            <input
              type="text"
              name="genre"
              value={formData.genre.join(', ')}
              onChange={handleGenreChange}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              placeholder="Action, Adventure, Drama"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">Overview*</label>
            <textarea
              name="overview"
              value={formData.overview}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Poster URL*</label>
            <input
              type="text"
              name="poster"
              value={formData.poster}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              placeholder="https://example.com/poster.jpg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Backdrop URL*</label>
            <input
              type="text"
              name="backdrop"
              value={formData.backdrop}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              placeholder="https://example.com/backdrop.jpg"
              required
            />
          </div>
          <div className="flex justify-end mt-8 gap-3">
          <button
            type="button"
            onClick={closeModals}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 bg-amber-500 text-gray-900 font-medium rounded hover:bg-amber-600 transition"
            disabled={loading}
          >
            {loading ? 'Processing...' : submitText}
          </button>
        </div>
        </div>
        </div>
    );
}