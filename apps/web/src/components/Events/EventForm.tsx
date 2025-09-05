import { Calendar, MapPin, FileText, Clock, X, Save } from "lucide-react";

interface Spot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  coordinates?: Array<{ lat: number; lng: number; name?: string }>;
}

interface FormData {
  title: string;
  notes: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  locationType: "text" | "spot";
  selectedSpotId: string;
  selectedMarkerIndexes: number[];
  locationText: string;
}

interface EventFormProps {
  formData: FormData;
  spots: Spot[];
  isSubmitting: boolean;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onMarkerToggle: (markerIndex: number) => void;
  onSelectAllMarkers: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitButtonText?: string;
}

export default function EventForm({
  formData,
  spots,
  isSubmitting,
  onInputChange,
  onMarkerToggle,
  onSelectAllMarkers,
  onSubmit,
  onCancel,
  submitButtonText = "Create Event",
}: EventFormProps) {
  const selectedSpot = spots.find(
    (spot) => spot.id === formData.selectedSpotId
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Event Details and Date & Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Details */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Event Details
              </h3>
              <p className="text-sm text-gray-400">
                Basic information about your fishing event
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={onInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                placeholder="e.g., Morning Fishing at Lake Naroch"
              />
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={onInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                placeholder="Any additional notes about this event..."
              />
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <Clock className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Date & Time</h3>
              <p className="text-sm text-gray-400">
                When did this event take place?
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Start Date & Time */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-300">Start</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-xs text-gray-400 mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
                <div>
                  <label
                    htmlFor="startTime"
                    className="block text-xs text-gray-400 mb-1"
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* End Date & Time */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-300">End</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-xs text-gray-400 mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endTime"
                    className="block text-xs text-gray-400 mb-1"
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-700/50 rounded-lg">
            <MapPin className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Location</h3>
            <p className="text-sm text-gray-400">
              Where did this event take place?
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Location Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Location Type
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="locationType"
                  value="text"
                  checked={formData.locationType === "text"}
                  onChange={onInputChange}
                  className="mr-3 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-gray-300">Free Text</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="locationType"
                  value="spot"
                  checked={formData.locationType === "spot"}
                  onChange={onInputChange}
                  className="mr-3 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-gray-300">Existing Spot</span>
              </label>
            </div>
          </div>

          {/* Free Text Location */}
          {formData.locationType === "text" && (
            <div>
              <label
                htmlFor="locationText"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Location Description
              </label>
              <input
                type="text"
                id="locationText"
                name="locationText"
                value={formData.locationText}
                onChange={onInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                placeholder="e.g., Lake Naroch, northern shore"
              />
            </div>
          )}

          {/* Existing Spot Selection */}
          {formData.locationType === "spot" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="selectedSpotId"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Select Spot
                </label>
                <select
                  id="selectedSpotId"
                  name="selectedSpotId"
                  value={formData.selectedSpotId}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                >
                  <option value="">Choose a spot...</option>
                  {spots.map((spot) => (
                    <option key={spot.id} value={spot.id}>
                      {spot.name} ({spot.latitude.toFixed(4)},{" "}
                      {spot.longitude.toFixed(4)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Marker Selection */}
              {selectedSpot && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Select Markers (choose multiple)
                    </label>
                    <button
                      type="button"
                      onClick={onSelectAllMarkers}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      {(() => {
                        const allMarkers = [
                          -1,
                          ...(selectedSpot.coordinates?.map(
                            (_, index) => index
                          ) || []),
                        ];
                        const allSelected = allMarkers.every((markerIndex) =>
                          formData.selectedMarkerIndexes.includes(markerIndex)
                        );
                        return allSelected ? "Deselect All" : "Select All";
                      })()}
                    </button>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-600/50 rounded-lg p-3 bg-gray-700/30">
                    {/* Primary marker option */}
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-600/30 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.selectedMarkerIndexes.includes(-1)}
                        onChange={() => onMarkerToggle(-1)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-white">
                          {selectedSpot.name} - Primary Location
                        </span>
                        <p className="text-xs text-gray-400">
                          {selectedSpot.latitude.toFixed(4)},{" "}
                          {selectedSpot.longitude.toFixed(4)}
                        </p>
                      </div>
                    </label>

                    {/* Additional markers */}
                    {selectedSpot.coordinates?.map((coord, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-600/30 p-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedMarkerIndexes.includes(
                            index
                          )}
                          onChange={() => onMarkerToggle(index)}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-white">
                            {selectedSpot.name} -{" "}
                            {coord.name || `Marker ${index + 2}`}
                          </span>
                          <p className="text-xs text-gray-400">
                            {coord.lat.toFixed(4)}, {coord.lng.toFixed(4)}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {formData.selectedMarkerIndexes.length > 0 && (
                    <p className="text-xs text-blue-400 mt-2">
                      {formData.selectedMarkerIndexes.length} marker(s) selected
                    </p>
                  )}
                </div>
              )}

              {/* Show selected location info */}
              {selectedSpot && formData.selectedMarkerIndexes.length > 0 && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center text-sm text-blue-300 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      {selectedSpot.name} -{" "}
                      {formData.selectedMarkerIndexes.length} marker(s) selected
                    </span>
                  </div>
                  <div className="space-y-1">
                    {formData.selectedMarkerIndexes.map((markerIndex) => (
                      <p key={markerIndex} className="text-xs text-blue-400">
                        {markerIndex === -1 ? (
                          <>
                            Primary: {selectedSpot.latitude.toFixed(4)},{" "}
                            {selectedSpot.longitude.toFixed(4)}
                          </>
                        ) : (
                          <>
                            {selectedSpot.coordinates?.[markerIndex]?.name ||
                              `Marker ${markerIndex + 2}`}
                            :{" "}
                            {selectedSpot.coordinates?.[
                              markerIndex
                            ]?.lat.toFixed(4)}
                            ,{" "}
                            {selectedSpot.coordinates?.[
                              markerIndex
                            ]?.lng.toFixed(4)}
                          </>
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
          disabled={isSubmitting}
        >
          <X className="w-5 h-5" />
          <span>Cancel</span>
        </button>
        <button
          type="submit"
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
          disabled={isSubmitting}
        >
          <Save className="w-5 h-5" />
          <span>{isSubmitting ? "Saving..." : submitButtonText}</span>
        </button>
      </div>
    </form>
  );
}
