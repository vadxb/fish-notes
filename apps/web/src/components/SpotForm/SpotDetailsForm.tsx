import { MapPin, FileText, Navigation } from "lucide-react";
import WaterBodySelector from "@web/components/WaterBodySelector";

interface WaterBody {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  country: string;
  region: string | null;
}

interface SpotDetailsFormProps {
  formData: {
    name: string;
    latitude: string;
    longitude: string;
    notes: string;
  };
  selectedWaterBody: WaterBody | null;
  isSubmitting: boolean;
  countryId?: string;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onWaterBodySelect: (waterBody: WaterBody | null) => void;
  onGetCurrentLocation: () => void;
}

export default function SpotDetailsForm({
  formData,
  selectedWaterBody,
  isSubmitting,
  countryId,
  onInputChange,
  onWaterBodySelect,
  onGetCurrentLocation,
}: SpotDetailsFormProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gray-700/50 rounded-lg">
          <MapPin className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Spot Details</h3>
          <p className="text-sm text-gray-400">
            Enter the basic information for your fishing spot
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Water Body Selector */}
        <WaterBodySelector
          onSelect={onWaterBodySelect}
          selectedWaterBody={selectedWaterBody}
          countryId={countryId}
        />

        {/* Spot Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Spot Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            required
            className="w-full px-3 py-2 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            placeholder="e.g., Lake Superior North Shore"
            disabled={isSubmitting}
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
            rows={3}
            className="w-full px-3 py-2 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            placeholder="Any additional notes about this spot..."
            disabled={isSubmitting}
          />
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="latitude"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Latitude *
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={onInputChange}
              required
              step="any"
              className="w-full px-3 py-2 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              placeholder="47.123456"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="longitude"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Longitude *
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={onInputChange}
              required
              step="any"
              className="w-full px-3 py-2 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              placeholder="-91.123456"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Current Location Button */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onGetCurrentLocation}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
            disabled={isSubmitting}
          >
            <Navigation className="w-4 h-4" />
            <span>Use Current Location</span>
          </button>
        </div>
      </div>
    </div>
  );
}
