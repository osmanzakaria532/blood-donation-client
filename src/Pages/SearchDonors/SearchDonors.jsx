import { useEffect, useMemo, useState } from 'react';
import { Droplet, Search } from 'lucide-react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const SearchDonors = () => {
  const axiosSecure = useAxiosSecure();
  const [locations, setLocations] = useState(null);
  const [bloodGroup, setBloodGroup] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadLocations = async () => {
      try {
        const res = await fetch('/bd-divisions-district-upazila-en.json');
        const data = await res.json();
        if (isMounted) setLocations(data);
      } catch {
        if (isMounted) setLocations(null);
      }
    };
    loadLocations();
    return () => {
      isMounted = false;
    };
  }, []);

  const districts = useMemo(() => {
    if (!locations?.divisions) return [];
    return locations.divisions.flatMap((d) => d.districts.map((dt) => dt.name));
  }, [locations]);

  const upazilas = useMemo(() => {
    if (!locations?.divisions || !district) return [];
    const districtData = locations.divisions
      .flatMap((d) => d.districts)
      .find((dt) => dt.name === district);

    if (!districtData?.upazilas?.length) return [];
    if (typeof districtData.upazilas[0] === 'string') return districtData.upazilas;
    return districtData.upazilas.map((u) => u.name);
  }, [locations, district]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bloodGroup || !district || !upazila) {
      alert('Please fill in all fields');
      return;
    }

    setHasSearched(true);
    setLoading(true);
    setResults([]);

    try {
      const res = await axiosSecure.get('/donors', {
        params: {
          bloodGroup,
          district,
          upazila,
        },
      });
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFF8F0] to-[#E8E4DF] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fadeInDown">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#C41E3A] uppercase mb-2 flex items-center justify-center gap-3">
            <Droplet className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 fill-[#C41E3A]" />
            Blood Donor Search
          </h1>
          <p className="text-gray-600 text-lg font-medium">Find life-saving donors in your area</p>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-lg relative overflow-hidden animate-fadeInUp">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#C41E3A] via-[#8B0000] to-[#C41E3A] animate-gradientShift"></div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Search className="h-6 w-6 text-[#C41E3A]" />
            Search for Donors
          </h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={handleSearch}>
            <div className="flex flex-col gap-2">
              <label className="font-semibold uppercase text-gray-900">Blood Group</label>
              <select
                className="border-2 border-gray-300 rounded-xl p-4 pr-12 focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A] cursor-pointer appearance-none"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold uppercase text-gray-900">District</label>
              <select
                className="border-2 border-gray-300 rounded-xl p-4 pr-12 focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A] cursor-pointer appearance-none"
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setUpazila('');
                }}
                required
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold uppercase text-gray-900">Upazila</label>
              <select
                className="border-2 border-gray-300 rounded-xl p-4 pr-12 focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A] cursor-pointer appearance-none"
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                required
                disabled={!district}
              >
                <option value="">Select Upazila</option>
                {upazilas.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 flex justify-center mt-4">
              <button
                type="submit"
                className="bg-linear-to-br from-[#C41E3A] to-[#8B0000] text-white font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all inline-flex items-center gap-2"
              >
                <Search className="h-5 w-5" />
                Search Donors
              </button>
            </div>
          </form>
        </div>

        {!loading && results.length > 0 && (
          <div className="mt-12 animate-fadeInUp">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="text-2xl font-bold text-gray-900">Available Donors</h3>
              <span className="bg-[#C41E3A] text-white px-4 py-1 rounded-full font-semibold">
                {results.length} donor{results.length !== 1 ? 's' : ''} found
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((donor) => (
                <div
                  key={donor.email}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-xl border-2 border-transparent relative hover:border-[#C41E3A] transition-all"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C41E3A] scale-y-0 hover:scale-y-100 origin-bottom transition-transform"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{donor.displayName}</h4>
                      <p className="text-gray-500 text-sm">
                        {donor.upazila}, {donor.district}
                      </p>
                    </div>
                    <div className="bg-[#C41E3A] text-white px-4 py-2 rounded-lg font-bold text-lg text-center min-w-15">
                      {donor.bloodGroup?.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mb-4 text-gray-700 text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold">Email:</span>
                      <span>{donor.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Status:</span>
                      <span>{donor.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Role:</span>
                      <span>{donor.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-12 text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-[#C41E3A] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Searching for donors...</p>
          </div>
        )}

        {hasSearched && !loading && results.length === 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow p-10 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Donors Found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDonors;
