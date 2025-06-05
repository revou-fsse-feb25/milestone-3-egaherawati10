"use client";

import React from "react";

export default function DeleteModal({
    title,
    closeModals,
    handleDelete,
    loading}) {
    return (
        <div>
            <div onClick={closeModals}>
                <h2>Confirm Delete</h2>
                <button onClick={closeModals}></button>
            </div>
            <div>
                <p>Are you sure you want to delete <span className="font-bold">{title}</span>? This action cannot be undone</p>
            </div>
            <div>
                <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Movie'}
              </button>
            </div>
        </div>
    )
    }
    